import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/app/utils/api/socket";
import Marquee from "react-fast-marquee";

const QueueCall = ({ lokasi }) => {
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [visible, setVisible] = useState(false);
  const [speechQueue, setSpeechQueue] = useState([]);

  const socket = getSocket();
  const utteranceRef = useRef(null);
  const isSpeaking = useRef(false);
  const lastProcessedQueue = useRef(null);

  const announceQueue = (queueList) => {
    if (!window.speechSynthesis) {
      console.warn("? Web Speech API not supported.");
      return;
    }

    let index = 0;

    const speakNext = () => {
      if (index >= queueList.length) {
        isSpeaking.current = false;
        setSpeechQueue([]);
        return;
      }

      const queue = queueList[index];
      const { patient_name, queue_number, loket } = queue;

      if (!queue_number || !loket) {
        index++;
        speakNext();
        return;
      }

      lastProcessedQueue.current = queue;
      setQueueData({ loket, queueNumber: queue_number, name: patient_name });

      const spelledOutQueue = queue_number.split("").filter(char => char !== "-").join("  ");
      const message = `Nomor Obat ${spelledOutQueue}, dengan nama ${patient_name}, dipersilahkan menuju ke ${loket}`;

      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        isSpeaking.current = true;
        setLoading(true);
        setVisible(true);
      };

      utterance.onend = () => {
        setLoading(false);
        setTimeout(() => {
          setQueueData(null);
          index++;
          speakNext();
        }, 1000);
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        index++;
        speakNext();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.cancel(); // Reset TTS
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  // Fetch active loket from socket event
  useEffect(() => {
    const handleGetResponses = (payload) => {
      const active = payload.data.loketData?.filter(l => l.status.toLowerCase() === "active");
      if (active?.length > 0) {
        setSelectedLoket(active[0].loket_name);
        console.log("? Active Loket:", active[0].loket_name);
      }
    };

    socket.on("get_responses", handleGetResponses);

    return () => {
      socket.off("get_responses", handleGetResponses);
    };
  }, [socket]);

  // Listen to queue events
  useEffect(() => {
    const handleQueueUpdate = (payload) => {
      if (payload?.data?.length > 0) {
        console.log("?? Incoming queue:", payload.data);
        setSpeechQueue(payload.data);
      }
    };

    socket.on("send_queues_verif_frontend_BPJS", handleQueueUpdate);
    socket.on("send_queues_pickup_frontend_BPJS", handleQueueUpdate);

    return () => {
      socket.off("send_queues_verif_frontend_BPJS", handleQueueUpdate);
      socket.off("send_queues_pickup_frontend_BPJS", handleQueueUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking.current) {
      announceQueue(speechQueue);
    }
  }, [speechQueue]);

  if (!visible || !queueData) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 999
      }} />
      <div className="h-75 bg-blue-700 p-10 rounded-lg shadow-lg flex flex-col justify-center items-center"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          width: "600px"
        }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Pemanggilan Obat</h2>
        <p className="text-3xl font-bold text-white">Nomor Obat</p>
        <div className="number text-white font-bold text-9xl my-5" style={{ animation: "zoom-in-out 2s infinite" }}>
          {queueData.queueNumber}
        </div>
        <div className="text-xl mt-2">
          {queueData.patient_name}

        </div>
        <p className="text-3xl font-bold text-white">{queueData.loket}</p>
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
