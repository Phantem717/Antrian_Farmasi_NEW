import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/app/utils/api/socket";

const QueueCall = ({ lokasi }) => {
  console.log("LOCKASI QUEE", lokasi);

  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [selectedLoket2, setSelectedLoket2] = useState(null);
  const [visible, setVisible] = useState(false);
  
  const selectedLoketRef = useRef(null);
  const lastProcessedQueue = useRef(null);
  const currentUtterance = useRef(null);
  const isSpeaking = useRef(false);
  const speechQueueRef = useRef([]); // ✅ Use ref instead of state
  const processingTimeout = useRef(null);

  const socket = getSocket();

  // ✅ Improved announceQueue with proper cancellation
  const announceQueue = (queueList) => {
    console.log("LIST", queueList);
      console.log("📢 announceQueue called with:", queueList);
  console.log("📊 First queue item:", queueList[0]);
  console.log("📊 Queue structure:", JSON.stringify(queueList[0], null, 2));
  
    if (!window.speechSynthesis) {
      console.warn("⚠ Web Speech API is not supported in this browser.");
      return;
    }

    // ✅ Cancel any ongoing speech first
    if (currentUtterance.current) {
      window.speechSynthesis.cancel();
      currentUtterance.current = null;
    }

    if (isSpeaking.current) {
      console.log("⏭️ Already speaking, cancelling previous announcement");
      isSpeaking.current = false;
    }

    let index = 0;

    const speakNext = () => {
      if (index >= queueList.length) {
        isSpeaking.current = false;
        speechQueueRef.current = [];
        setVisible(false);
        console.log("CLEARED", queueList);
        return;
      }

      const queue = queueList[index];
      console.log("QUEUE", queue);

      const { patient_name, queue_number, loket } = queue;

      if (!queue_number || !loket) {
        console.warn("⚠ Nomor antrian atau loket tidak tersedia untuk diumumkan.");
        index++;
        speakNext();
        return;
      }

      lastProcessedQueue.current = queue;

      setQueueData({
        loket: loket,
        queueNumber: queue_number,
        name: patient_name,
      });

      const spelledOutQueue = queue_number.split("").filter(char => char !== "-").join("  ");
      const message = `Nomor Obat ${spelledOutQueue}, dengan nama ${patient_name}, dipersilahkan menuju ke ${loket}`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        isSpeaking.current = true;
        setLoading(false);
        console.log("🔊 Mulai pengumuman:", message);
      };

      utterance.onend = () => {
        console.log("✅ Selesai pengumuman");
        isSpeaking.current = false;
        setLoading(false);
        currentUtterance.current = null;
        
        setTimeout(() => {
          setQueueData(null);
          index++;
          speakNext();
        }, 1000);
      };

      utterance.onerror = (e) => {
        console.error("❌ Error saat pengumuman:", e);
        isSpeaking.current = false;
        currentUtterance.current = null;
        
        if (e.error === 'interrupted') {
          console.log("⏭️ Speech interrupted by new call");
        }
        
        index++;
        speakNext();
      };

      currentUtterance.current = utterance;
      window.speechSynthesis.cancel(); // ✅ Cancel before speaking
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const fetchActiveLoket = async () => {
    try {
      socket.on('get_responses', (payload) => {
        const activeLoket2 = payload.data.loketData.filter(
          loket => loket.status.toLowerCase() === "active"
        );
        if (activeLoket2.length > 0) {
          setSelectedLoket(activeLoket2[0]?.loket_name);
          setSelectedLoket2(activeLoket2[1]?.loket_name);
          console.log("✅ Loket aktif ditemukan:", activeLoket2[0]?.loket_name, activeLoket2[1]?.loket_name);
        } else {
          console.warn("⚠️ Tidak ada loket aktif.");
        }
      });
    } catch (error) {
      console.error("❌ Error fetching active loket:", error);
    }
  };

  useEffect(() => {
    fetchActiveLoket();
    selectedLoketRef.current = selectedLoket;
  }, [selectedLoket]);

  console.log(selectedLoketRef, "LKET", selectedLoket);

  // ✅ Setup socket listeners only once
  useEffect(() => {
    // ✅ Debounced handler to prevent rapid triggers
    const handleQueueUpdate = (payload) => {
      const data = payload.data;
      console.log("📨 Received queue update:", payload.message, data);
      
      if (!data || data.length === 0) return;

      // ✅ Clear any pending processing timeout
      if (processingTimeout.current) {
        clearTimeout(processingTimeout.current);
      }

      // ✅ Debounce: wait 300ms before processing
      processingTimeout.current = setTimeout(() => {
        console.log("TRIGGERED");
        
        // ✅ Cancel previous speech if any
        if (isSpeaking.current) {
          window.speechSynthesis.cancel();
          isSpeaking.current = false;
        }
        
        speechQueueRef.current = data;
        setVisible(true);
        announceQueue(data);
      }, 300); // 300ms debounce
    };

    // ✅ Setup listeners based on location
    if (lokasi == "bpjs") {
      console.log("BPJS");
      socket.on('send_queues_verif_frontend_BPJS', handleQueueUpdate);
      socket.on('send_queues_pickup_frontend_BPJS', handleQueueUpdate);
    } else if (lokasi == "gmcb") {
      console.log("GMCB");
      socket.on('send_queues_verif_frontend_GMCB', handleQueueUpdate);
      socket.on('send_queues_pickup_frontend_GMCB', handleQueueUpdate);
    }

    // ✅ Cleanup
    return () => {
      if (processingTimeout.current) {
        clearTimeout(processingTimeout.current);
      }
      
      socket.off('send_queues_pickup_frontend_BPJS', handleQueueUpdate);
      socket.off('send_queues_verif_frontend_BPJS', handleQueueUpdate);
      socket.off('send_queues_pickup_frontend_GMCB', handleQueueUpdate);
      socket.off('send_queues_verif_frontend_GMCB', handleQueueUpdate);
      
      // ✅ Cancel any ongoing speech on unmount
      if (currentUtterance.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lokasi]); // ✅ Only re-run if lokasi changes

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          zIndex: 999,
        }}
      />
      <div
        className="h-75 bg-blue-700 p-10 rounded-lg shadow-lg flex flex-col justify-center items-center"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          width: "800px"
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Pemanggilan Obat</h2>
        <p className="text-3xl font-bold text-white">Nomor Obat</p>
        <div
          className="number text-white -bold text-9xl my-5"
          style={{ animation: "zoom-in-out 2s infinite" }}
        >
          {loading ? "Memuat..." : queueData ? queueData.queueNumber : "..."}
        </div>
        <div className="text-white w-full font-extrabold text-5xl mb-5 mt-3 text-center truncate whitespace-nowrap overflow-hidden leading-tight">
          {queueData ? queueData.name : "..."}
        </div>
        <p className="text-3xl font-bold text-white">
          {loading ? "Memuat..." : queueData ? queueData.loket : "Loket Tidak Diketahui"}
        </p>
        <style jsx>{`
          @keyframes zoom-in-out {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </>
  );
};

export default QueueCall;