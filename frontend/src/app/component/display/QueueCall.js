import { useEffect, useState, useRef } from "react";
import VerificationAPI from "../../utils/api/Verification";
import MedicineAPI from "../../utils/api/Medicine";
import PickupAPI from "../../utils/api/Pickup";
import LoketAPI from "../../utils/api/Loket";
import {getSocket} from "@/app/utils/api/socket";
const QueueCall = ({lokasi}) => {
  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [selectedLoket2,setSelectedLoket2]= useState(null);
  const [speechQueue,setSpeechQueue]= useState([]);
  const selectedLoketRef = useRef(null);
  const lastProcessedQueue = useRef(null);

  const currentQueue = useRef(null);
  const isSpeaking = useRef(false);

const socket = getSocket();
const utteranceRef = useRef(null);
  let testArray = [];
  const announceQueue = (queueList) => {
    console.log("LIST",queueList);
    if (!window.speechSynthesis) {
      console.warn("? Web Speech API is not supported in this browser.");
      return;
    }
  
    let index = 0;
    if (index >= queueList.length) {
      isSpeaking.current = false;
      setSpeechQueue([]); // ? Clear the list
      console.log("CLEARED",queueList);
      return;
    }
  
    const speakNext = () => {
      if (index >= queueList.length) {
        isSpeaking.current = false;
        setSpeechQueue([]); // ? Clear the list
        console.log("CLEARED",queueList);

        return;
      }
  
      const queue = queueList[index];
      console.log("QUEUE",queue);
      const { patient_name, queue_number, loket } = queue;
  
      if (!queue_number || !loket) {
        console.warn("? Nomor antrian atau loket tidak tersedia untuk diumumkan.");
        index++;
        speakNext(); // skip and continue to next
        return;
      }
  
      lastProcessedQueue.current = queue;
  
      setQueueData({
        loket: loket,
        queueNumber: queue_number,
        name: patient_name,
      });
  
      const spelledOutQueue = queue_number.split("").filter(char => char !== "-").join("  ");
      const message = `Nomor antrian ${spelledOutQueue}, dengan nama ${patient_name}, dipersilahkan menuju ke ${loket}`;
  
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 1;
  
      utterance.onstart = () => {
        isSpeaking.current = true;
        setLoading(true);
        setLoading(false);

        console.log("?? Mulai pengumuman:", message);
      };
  
      utterance.onend = () => {
        console.log("? Selesai pengumuman");
        isSpeaking.current = false;
        setLoading(false);
        setTimeout(() => {
          setQueueData(null);
          index++;
          speakNext(); // ?? Lanjut ke antrian berikutnya
        }, 1000);
      };
  
      utterance.onerror = (e) => {
        console.error("?? Error saat pengumuman:", e);
        index++;
        speakNext(); // skip ke berikutnya
      };
  
      utteranceRef.current = utterance;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };
  
    speakNext(); // ?? mulai
  };
  

const fetchActiveLoket = async () => {
  try {
    socket.on('get_responses',(payload)=>{
      const activeLoket2 = payload.data.loketData.filter(loket => loket.status.toLowerCase() === "active");
      if (activeLoket2) {
        setSelectedLoket(activeLoket2[0].loket_name);
        setSelectedLoket2(activeLoket2[1].loket_name);
        console.log("✅ Loket aktif ditemukan:", activeLoket2[0].loket_name,activeLoket2[1].loket_name);
      } else {
        console.warn("⚠️ Tidak ada loket aktif.");
      }
    });
 
  } catch (error) {
    console.error("❌ Error fetching active loket:", error);
  }
};


  // ✅ Ambil Loket Aktif dari API
  useEffect(() => {
   
    
  
    fetchActiveLoket();
    selectedLoketRef.current = selectedLoket;
  // selectedLoket2Ref.current = selectedLoket2;
  }, []);

  console.log(selectedLoketRef,"LKET",selectedLoket);
  useEffect(() => {
    const handleQueueUpdate = (payload) => {

     const data =payload.data[0];
      console.log("?? Received update_status_medicine_type:", payload.message, data,payload.data.loket);
      if (!payload.data) return;
      setSpeechQueue(data);
    };
    socket.on('send_queues_verif_frontend', handleQueueUpdate);
  socket.on('send_queues_pickup_frontend', handleQueueUpdate);

   
  socket.on('send_queues',(payload) =>{
    console.log("PAYLOAD",payload);
  });
  console.log("TEST2",testArray);
    return () => {
      socket.off('update_status_medicine_type', handleQueueUpdate);
      socket.off('update_status_type',handleQueueUpdate);
      socket.off('send_queues_pickup_frontend',handleQueueUpdate);
      socket.off('send_queues_verif_frontend',handleQueueUpdate);

      // consoo=length.log("SOCKET DISCONNECTED");
      socket.disconnect();
    };
  }, [socket]); // Only runs once

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking.current) {
      announceQueue(speechQueue);
    }
  }, [speechQueue]);
  
  

  return (
    <div className="h-full bg-blue-700 p-6 rounded-lg shadow-lg flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold text-white mb-4">Pemanggilan Antrian</h2>
      <p className="text-3xl font-bold text-white">Nomor Antrian</p>
      <div className="number text-white -bold text-9xl my-5" style={{ animation: "zoom-in-out 2s infinite" }}>
        {loading ? "Memuat..." : queueData ? queueData.queueNumber : "..." }
        
      </div>
      <p className="text-3xl my-5 font-bold text-white" style={{ animation: "zoom-in-out 2s infinite" }}>
        {loading ? "..." : queueData?.name ?? ""}
        </p>
      
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
  );
  
  return { queueData, isSpeaking }; // Expose data only

};

export default QueueCall;
