import { useEffect, useState, useRef } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import LoketAPI from "@/app/utils/api/Loket";
import {getSocket} from "@/app/utils/api/socket";


const QueueCall = ({lokasi}) => {

  const [loading, setLoading] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [selectedLoket, setSelectedLoket] = useState(null);
  const [selectedLoket2,setSelectedLoket2]= useState(null);
  const [speechQueue,setSpeechQueue]= useState([]);
  const selectedLoketRef = useRef(null);
  const lastProcessedQueue = useRef(null);
  const [visible,setVisible] = useState(false);
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
      const message = `Nomor Obat ${spelledOutQueue}, dengan nama ${patient_name}, dipersilahkan menuju ke ${loket}`;
  
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "id-ID";
      utterance.rate = 1;
      utterance.volume = 1;
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
        console.log("? Loket aktif ditemukan:", activeLoket2[0].loket_name,activeLoket2[1].loket_name);
      } else {
        console.warn("?? Tidak ada loket aktif.");
      }
    });
   
  } catch (error) {
    console.error("? Error fetching active loket:", error);
  }
};


  // ? Ambil Loket Aktif dari API
  useEffect(() => {
   
    
  
    fetchActiveLoket();
    selectedLoketRef.current = selectedLoket;
  // selectedLoket2Ref.current = selectedLoket2;
  }, []);

  console.log(selectedLoketRef,"LKET",selectedLoket);
  useEffect(() => {
    const handleQueueUpdate = (payload) => {
            // setLoading(true);

     const data =payload.data[0];
      console.log("?? Received update_status_medicine_type:", payload.message, data,payload.data.loket);
      if (!payload.data) return;
      console.log("TRIGGERED");
      setSpeechQueue(data);

    };
    socket.on('send_queues_verif_frontend_BPJS', handleQueueUpdate);
  socket.on('send_queues_pickup_frontend_BPJS', handleQueueUpdate);

  
  socket.on('send_queues',(payload) =>{
    console.log("PAYLOAD",payload);
  });
  console.log("TEST2",testArray);
    return () => {
      socket.off('update_status_medicine_type', handleQueueUpdate);
      socket.off('update_status_type',handleQueueUpdate);
      socket.off('send_queues_pickup_frontendBPJS',handleQueueUpdate);
      socket.off('send_queues_verif_frontend_BPJS',handleQueueUpdate);

      socket.disconnect();
    };
  }, [socket]); // Only runs once

  useEffect(() => {
    if (speechQueue.length > 0 && !isSpeaking.current) {
      setVisible(true);

      announceQueue(speechQueue);
    }
    else{
      setVisible(false);
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

    }}
    >
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