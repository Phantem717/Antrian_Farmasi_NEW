import { useEffect, useState, useRef } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import LoketAPI from "@/app/utils/api/Loket";
import {getSocket} from "@/app/utils/api/socket";
const QueueCall_g = ({lokasi}) => {
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
    // const response = await LoketAPI.getAllLokets();
    // console.log("📡 Loket yang diterima dari API:", response.data);
    // const activeLoket2 = response.data.filter(loket => loket.status.toLowerCase() === "active");
    // console.log("LOCKET",activeLoket2);
    // const activeLoket = response.data.find(loket => loket.status.toLowerCase() === "active");
   
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
            // setLoading(true);

     const data =payload.data[0];
      console.log("?? Received update_status_medicine_type:", payload.message, data,payload.data.loket);
      if (!payload.data || payload.lokasi !== "Lantai 1 GMCB") return;
      setSpeechQueue(data);

      // data.forEach((queue)=>{
      //   if(isSpeaking.current == false){
      //     setQueueData({
      //       queueNumber: queue.queue_number,
      //       counter: queue.loket,
      //       name: queue.patient_name,
      //       });

      //       announceQueue(queue.queue_number, queue.loket, queue.patient_name);

      //   }
      // });
    // const nextQueue = data.find(queue => lastProcessedQueue.current !== queue.queue_number);
    // console.log("NEXTQUQUE",nextQueue);
    // if(nextQueue){
    // lastProcessedQueue.current = nextQueue.queue_number;
    // const loket = nextQueue.status?.includes("verification")
    // ? nextQueue.loket
    // : nextQueue.loket2;

    // setTimeout(()=> {
    //   setQueueData({
    //     queueNumber: nextQueue.queue_number,
    //     counter: nextQueue.loket,
    //     name: nextQueue.patient_name,
    //     });

    // }, 1000);
   

    //   setLoading(false);

    // }
      // data.map((payload)=> {
      //   console.log("PAYLOAD",payload);

  
      // // setLoading(true);
      // // setTimeout(() => setLoading(false), 1000);
      // // testArray.push(payload);
      // // console.log("TEST",testArray,payload, testArray.length);
      // announceQueue(payload.queue_number, loket, payload.patient_name);
      
      // });


      

    };
    socket.on('send_queues_verif_frontend', handleQueueUpdate);
  socket.on('send_queues_pickup_frontend', handleQueueUpdate);

    // socket.on('update_status_medicine_type', handleQueueUpdate);
    
    // socket.on('update_status_type',handleQueueUpdate);
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
  
  
  // ✅ Ambil Data Antrian dengan Semua Status yang Dibutuhkan
  // 
  
  // useEffect(() => {
  //   console.log("TEST2");
  //   socket.on("connect", () => {
  //     console.log("? Connected to socket server");
  //   });
  //   socket.onAny((event, ...args) => {
  //     console.log("?? Received event:", event, args);
  //   });
    
  //   socket.on("update_called", ({ message, data }) => {
  //     console.log("? Received update_called:");
  //     console.log("Message:", message);
  //     console.log("Data:", data);
    
  //     if (!data) {
  //       console.warn("?? No data in update_called payload");
  //       return;
  //     }
    
  //     announceQueue(data.queue_number, selectedLoket2, data.patient_name);
  //     setQueueData({
  //       queueNumber: data.queue_number,
  //       counter: selectedLoket2,
  //       name: data.patient_name,
  //     });
    
  //     setLoading(true);
  //   });

  //    return ()=>{
  //     socket.disconnect();
  //     console.log("SOCKET DISC");
  //    }
  //   const fetchQueues = async () => {
  //     setLoading(true);
  //     try {
  //       // Ambil semua data antrian dari API
  //       const [verificationRes, medicineRes, pickupRes] = await Promise.all([
  //         VerificationAPI.getAllVerificationTasks(),
  //         MedicineAPI.getAllMedicineTasks(),
  //         PickupAPI.getAllPickupTasks(),
  //       ]);

  //       console.log("📡 Data antrian dari API:", {
  //         verification: verificationRes.data,
  //         medicine: medicineRes.data,
  //         pickup: pickupRes.data
  //       });

  //       // Gabungkan semua antrian dan filter berdasarkan status yang diinginkan
  //       const validStatuses = [
  //         "called_verification", "called_medicine", "called_pickup_medicine",
  //         "recalled_verification", "recalled_medicine", "recalled_pickup_medicine"
  //       ];

  //       const allQueues = [...verificationRes.data, ...medicineRes.data, ...pickupRes.data]
  //         .filter(item => validStatuses.includes(item.status));

  //       console.log("✅ Antrian yang memiliki status yang sesuai:", allQueues);

  //       // Pilih antrian pertama yang belum diproses
  //       const nextQueue = allQueues.find(queue => lastProcessedQueue.current !== queue.queue_number);

  //       if (nextQueue) {
  //         console.log("queue",nextQueue.patient_name);
  //         lastProcessedQueue.current = nextQueue.queue_number;
  //         if(nextQueue.status=="recalled_verification" || nextQueue.status=="called_verification"){
  //           console.log("VERIF")
  //           setQueueData({ queueNumber: nextQueue.queue_number, counter: selectedLoket, name: nextQueue.patient_name });

  //         }
  //         else if(nextQueue.status=="recalled_pickup_medicine" || nextQueue.status=="called_pickup_medicine"){
  //           console.log("PICKUP")
  //           setQueueData({ queueNumber: nextQueue.queue_number, counter: selectedLoket2, name: nextQueue.patient_name });

  //         }
  //         setTimeout(() => {
  //           if(nextQueue.status=="recalled_verification" || nextQueue.status=="called_verification"){
  //             console.log("VERIF")
  //             announceQueue(nextQueue.queue_number, selectedLoket, nextQueue.patient_name);

  //           }
  //           else if(nextQueue.status=="recalled_pickup_medicine" || nextQueue.status=="called_pickup_medicine"){
  //             console.log("PICKUP")
  //             announceQueue(nextQueue.queue_number, selectedLoket2, nextQueue.patient_name);

  //           }

            
           

  //           setLoading(false);
           

  //         }, 1000);
  //       } else {
  //         setQueueData(null);
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       console.error("❌ Error fetching queue data:", error);
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchQueues();
  //   const interval = setInterval(fetchQueues, 10000);
  //   return () => clearInterval(interval);
  // }, [selectedLoket]);
  
  // ✅ Fungsi untuk pengumuman suara antrian
  

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
};

export default QueueCall_g;
