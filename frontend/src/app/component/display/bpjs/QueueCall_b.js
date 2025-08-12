import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/app/utils/api/socket";

const QueueCall = ({ lokasi }) => {
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [selectedLoket2, setSelectedLoket2] = useState(null);
  const [speechQueue, setSpeechQueue] = useState([]);
  const [visible, setVisible] = useState(false);
  
  const selectedLoketRef = useRef(null);
  const lastProcessedQueue = useRef(null);
  const currentQueue = useRef(null);
  const isSpeaking = useRef(false);
  const utteranceRef = useRef(null);
  
  const socket = getSocket();

  const announceQueue = (queueList) => {
    if (!window.speechSynthesis) {
      console.warn("Web Speech API not supported");
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
      if (!queue?.queue_number || !queue?.loket) {
        index++;
        speakNext();
        return;
      }

      lastProcessedQueue.current = queue;
      setQueueData({
        loket: queue.loket,
        queueNumber: queue.queue_number,
        name: queue.patient_name
      });

      const message = `Nomor Obat ${queue.queue_number}, dengan nama ${queue.patient_name}, dipersilahkan menuju ke ${queue.loket}`;
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        isSpeaking.current = true;
        setLoading(true);
      };

      utterance.onend = () => {
        isSpeaking.current = false;
        setLoading(false);
        index++;
        speakNext();
      };

      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        isSpeaking.current = false;
        setLoading(false);
        index++;
        speakNext();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  useEffect(() => {
    const handleQueueUpdate = (payload) => {
      if (payload.data) {
        setSpeechQueue(prev => [...prev, ...payload.data]);
      }
    };

    socket.on('send_queues_verif_frontend_BPJS', handleQueueUpdate);
    socket.on('send_queues_pickup_frontend_BPJS', handleQueueUpdate);

    return () => {
      socket.off('send_queues_verif_frontend_BPJS', handleQueueUpdate);
      socket.off('send_queues_pickup_frontend_BPJS', handleQueueUpdate);
    };
  }, []);

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking.current) {
      setVisible(true);
      announceQueue(speechQueue);
    }
  }, [speechQueue]);

  if (!visible) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 999,
      }} />
      
      <div className="h-75 bg-blue-700 p-10 rounded-lg shadow-lg flex flex-col justify-center items-center" 
           style={{
             position: 'fixed',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             zIndex: 1000,
             width: "800px"
           }}>
        <h2 className="text-3xl font-bold text-white mb-4">Pemanggilan Obat</h2>
        <p className="text-3xl font-bold text-white">Nomor Obat</p>
        <div className="number text-white -bold text-9xl my-5" style={{ animation: "zoom-in-out 2s infinite" }}>
          {loading ? "Memuat..." : queueData ? queueData.queueNumber : "..." }
        </div>
        <div className="text-white w-full font-extrabold text-5xl mb-5 mt-3 text-center truncate whitespace-nowrap overflow-hidden leading-tight">
          {queueData ? queueData.name : "..."}
        </div>
        <p className="text-3xl font-bold text-white">
          {loading ? "Memuat..." : queueData ? queueData.loket : "Loket Tidak Diketahui"}
        </p>
      </div>
    </>
  );
};

export default QueueCall;