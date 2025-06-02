import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import {getSocket} from "@/app/utils/api/socket";
import { TaskSharp } from "@mui/icons-material";
const NextQueue = ({verificationData, medicineData, pickupData}) => {
  // State untuk menyimpan antrian dari API
  const [queues, setQueues] = useState({
    nextQueueRacik: [],
    nextQueueNonRacik: [],
    medicineRacik: [],
    medicineNonRacik: [],
    pickupRacik: [],
    pickupNonRacik: [],
    verificationQueue: [],
    pickupQueue: []

  });


  // Refs untuk auto-scroll
  const nextQueueRefRacik = useRef(null);
  const nextQueueRefNonRacik = useRef(null);

  const medicineRefRacik = useRef(null);
  const medicineRefNonRacik = useRef(null);

  const verifRef = useRef(null);
  const pickupRef = useRef(null);

  const pickupRefRacik = useRef(null);
  const pickupRefNonRacik = useRef(null);

  const scrollPos = {
    nextRacik: nextQueueRefRacik.scrollTop??0,
    nextNonRacik: nextQueueRefNonRacik.scrollTop??0,

    medicineRacik: medicineRefRacik.scrollTop ?? 0,
    medicineNonRacik: medicineRefNonRacik.scrollTop ?? 0,

    verifRef: verifRef.scrollTop ?? 0,
    pickupRef: pickupRef.scrollTop ?? 0,

    pickupRacik: pickupRefRacik.scrollTop ?? 0,
    pickupNonRacik: pickupRefNonRacik.scrollTop ?? 0

  }
  // Fungsi Auto-scroll
  const autoScroll = (ref) => {
    if (!ref.current) return;
    const scrollSpeed = 2;
    const delayBeforeReset = 5000;

    const scroll = () => {
      if (!ref.current) return;
      const maxScroll = ref.current.scrollHeight - ref.current.clientHeight;

      if (ref.current.scrollTop < maxScroll) {
        ref.current.scrollBy({ top: scrollSpeed, behavior: "smooth" });
        requestAnimationFrame(scroll);
      } else {
        setTimeout(() => {
          ref.current.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => requestAnimationFrame(scroll), delayBeforeReset);
        }, delayBeforeReset);
      }
    };

    requestAnimationFrame(scroll);
  };

  // Efek Scroll Otomatis untuk Semua Antrian
  useEffect(() => {
    autoScroll(nextQueueRefRacik);
    autoScroll(nextQueueRefNonRacik);

    autoScroll(medicineRefRacik);
    autoScroll(medicineRefNonRacik);

    autoScroll(verifRef);
    autoScroll(pickupRef);

    autoScroll(pickupRefRacik);
    autoScroll(pickupRefNonRacik);
  }, [queues]);

  // 🔄 Ambil data antrian dari API saat komponen pertama kali di-load
  useEffect(() => {
    const socket = getSocket();
    const fetchQueues = async () => {
      try {
        // Fetch Verifikasi (Status: waiting_verification)
        socket.on('get_responses',(payload)=>{
          const dateString = new Date().toISOString().split('T')[0];
          console.log("PAYLOAD",payload);

          const verificationData = payload.data.verificationData.filter(
            (task) =>{
              if (!task || !task.status || task.waiting_verification_stamp === undefined) {
                return false;
              }
              
              // Convert string timestamps to Date objects if needed
              const verificationStamp = typeof task.waiting_verification_stamp === 'string' 
                ? new Date(task.waiting_verification_stamp) 
                : task.waiting_verification_stamp;
      
                const verifDateString = verificationStamp.toISOString().split('T')[0];

              return task.status.includes("verification") && verifDateString == dateString 

            } ).map(task =>            
        ({
            queueNumber: task.queue_number,
            // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
          type: task.status_medicine ,
          status: task.status 
          
          == "waiting_verification" ? "Menunggu" 
         : task.status == "called_verification" ? "Dipanggil" 
         : task.status == "pending_verification" ? "Terlewat" 
         : task.status == "recalled_verification" ? "Dipanggil"
        : task.status == "processed_verification" ? "Verifikasi"
         : "-" // fallback to original status if no match
        }));
        
          console.log("VERFIDATA",verificationData);;

          const medicineData = payload.data.medicineData.filter((task) =>{
            if (!task || !task.status || task.waiting_medicine_stamp === undefined) {
              return false;
            }
            
            // Convert string timestamps to Date objects if needed
            const medicineStamp = typeof task.waiting_medicine_stamp === 'string' 
              ? new Date(task.waiting_medicine_stamp) 
              : task.waiting_medicine_stamp;
    
              const medicineDateString = medicineStamp.toISOString().split('T')[0];

            return task.status.includes("waiting_medicine") && medicineDateString == dateString 

          })
          .map(task => ({
            queueNumber: task.queue_number,
            // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
                        type: task.status_medicine ,
                        status : task.status

          }));
          console.log("MEDS",medicineData);

          const pickupData = payload.data.pickupData.filter((task) =>{
            if (!task || !task.status || task.waiting_pickup_medicine_stamp === undefined) {
              return false;
            }
            
            // Convert string timestamps to Date objects if needed
            const pickupStamp = typeof task.waiting_pickup_medicine_stamp === 'string' 
              ? new Date(task.waiting_pickup_medicine_stamp) 
              : task.waiting_pickup_medicine_stamp;
    
              const pickupDateString = pickupStamp.toISOString().split('T')[0];

            return task.status.includes("pickup") && task.status != "completed_pickup_medicine" && pickupDateString == dateString 

          })
          .map(task => ({
            queueNumber: task.queue_number,
            // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
            type: task.status_medicine ,
            status : task.status  == "waiting_pickup_medicine" ? "Menunggu" 
            : task.status == "called_pickup_medicine" ? "Dipanggil" 
            : task.status == "pending_pickup_medicine" ? "Terlewat" 
            : task.status == "recalled_pickup_medicine" ? "Dipanggil"
            : "-"

          }));
          console.log("PICKUP",pickupData);
          setQueues({
            verificationQueue: verificationData,
            pickupQueue: pickupData,

            nextQueueRacik: verificationData.filter(task => task.type === "Racikan"),
            nextQueueNonRacik: verificationData.filter(task => task.type === "Non - Racikan"),
            medicineRacik: medicineData.filter(task => task.type === "Racikan"),
            medicineNonRacik: medicineData.filter(task => task.type === "Non - Racikan"),
            pickupRacik: pickupData.filter(task => task.type === "Racikan"),
            pickupNonRacik: pickupData.filter(task => task.type === "Non - Racikan"),
          });
    
        });
       
        setTimeout(() => {
          if (nextQueueRefRacik.current) nextQueueRefRacik.current.scrollTop = scrollPos.nextRacik;
          if (nextQueueRefNonRacik.current) nextQueueRefNonRacik.current.scrollTop = scrollPos.nextNonRacik;

          if (medicineRefRacik.current) medicineRefRacik.current.scrollTop = scrollPos.medicineRacik;
          if (medicineRefNonRacik.current) medicineRefNonRacik.current.scrollTop = scrollPos.medicineNonRacik;

          if(verifRef.current) verifRef.current.scrollTop = scrollPos.verifRef;
          if(pickupRef.current) pickupRef.current.scrollTop = scrollPos.pickupRef;

          if (pickupRefRacik.current) pickupRefRacik.current.scrollTop = scrollPos.pickupRacik;
          if (pickupRefNonRacik.current) pickupRefNonRacik.current.scrollTop = scrollPos.pickupNonRacik;
        }, 0); // Wait for React to finish render

      } catch (error) {
        console.error("? Error fetching queue data:", error);
      }
    };
  
    fetchQueues();
  }, []);
  

  // Komponen untuk Setiap Kategori Antrian
  const QueueSection = ({ title, queuesRacik, queuesNonRacik, innerRefRacik,innerRefNonRacik, bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "300px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>

      <div className="flex gap-2 mt-2">
        {/* Racikan */}
        <div className="flex-1 bg-white p-2 rounded-md shadow-md">
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
          <div
            className="scrollable-table overflow-y-auto scrollbar-hide bg-white rounded-md p-2"
            ref={innerRefRacik}
            style={{ minHeight: "800px" }}
          >
            {queuesRacik.length > 0 ? (
              queuesRacik.map((queue, index) => (
                <span
                  key={index}
                  className="flex items-center  justify-center bg-white text-green-700 text-5xl p-2 shadow text-center font-bold border border-gray-300 rounded block mb-1"
                  style={{height: "80px"}}

               >
                  {queue.queueNumber}
                  {/* {queue.type} */}
                </span>
              ))
            ) : (
              <span className="bg-white text-black p-2 shadow text-center font-bold text-2xl block">
                Belum Ada Antrian
              </span>
            )}
          </div>
        </div>

        {/* Non-Racikan */}
        <div className="flex-1 bg-white p-2 rounded-md shadow-md">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
          <div
            className="scrollable-table overflow-y-auto scrollbar-hide bg-white rounded-md p-2"
            ref={innerRefNonRacik}
            style={{ minHeight: "300px" }}
          >
            {queuesNonRacik.length > 0 ? (
              queuesNonRacik.map((queue, index) => (
                <span
                  key={index}
                  className="flex items-center  justify-center bg-white text-green-700 text-5xl p-2 shadow text-center font-bold border border-gray-300 rounded block mb-1"
                  style={{height: "80px"}}

               >
                  {queue.queueNumber}
                  {/* {queue.type} */}

                </span>
              ))
            ) : (
              <span className="bg-white text-black p-2 shadow text-center font-bold text-2xl block">
                Belum Ada Antrian
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const QueueSectionVerification = ({ title, queues, innerRef, bgColor }) => {
    // Define status-color mapping
    const getStatusColor = (status) => {
      switch(status) {
        case 'Menunggu': return 'text-yellow-600'; // Yellow for waiting
        case 'Dipanggil': return 'text-green-600'; // Green for called
        case 'Terlewat': return 'text-red-600';
        case 'Verifikasi': return 'text-blue-600'    // Red for missed
        // Gray for completed
        default: return 'text-black';              // Default color
      }
    };

    const getStatusColourBorder = (status) => {
      switch(status){
        case 'Menunggu': return 'border-2 border-yellow-500'; // Yellow for waiting
        case 'Dipanggil': return 'border-2 border-green-500'; // Green for called
        case 'Terlewat': return 'border-2 border-red-500'; 
        case 'Verifikasi': return 'border-2 border-blue-500'    // Red for missed

      }
    }
  
    return (
      <div
        className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`}
        style={{ minHeight: "300px" }}
      >
        <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
    
        <div className="flex gap-2 mt-2">
          {/* Racikan */}
          <div className="flex-1 bg-white p-2 rounded-md shadow-md">
            <div
              className="scrollable-table  overflow-y-auto scrollbar-hide bg-white rounded-md p-2 "
              ref={innerRef}
              style={{ height: "825px" }}
            >
              {queues.length > 0 ? (
                queues.map((queue, index) => (
                  <div
                    key={index}
                    className={`uppercase bg-white p-2 shadow text-center font-extrabold border border-gray-300 rounded mb-1 flex items-center ${getStatusColourBorder(queue.status)}` }
                    style={{height: "120px"}}
                  >
                    <div className={`flex-1 text-4xl text-left ${getStatusColor(queue.status)}`}>
                      {queue.queueNumber}
                    </div>
                    <div className={`flex-1 text-3xl text-center ${getStatusColor(queue.status)}`}>
                      {queue.type}
                    </div>
                    <div className={`flex-1 text-3xl text-right ${getStatusColor(queue.status)}`}>
                      {queue.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">
                  Belum Ada Antrian
                </div>
              )}
            </div>
          </div>
    
          {/* Non-Racikan (add similar layout here) */}
        </div>
      </div>
    );
  };
  

  return (
    <div className="bg-white p-4 shadow-lg border border-green-700 w-full ">
      <div className="w-full mb-4">
        {/* <h2 className="text-3xl font-bold text-green-700 text-center">Antrian Selanjutnya</h2> */}
      </div>

      <div className="flex w-full gap-4 flex-wrap justify-center">
        {/* Antrean Selanjutnya */}
        <QueueSectionVerification title="Proses Verifikasi" queues={queues.verificationQueue} innerRef={verifRef} bgColor="bg-green-700"/>

        {/* Proses Pembuatan Obat */}
        <QueueSection title="Proses Pembuatan Obat" queuesRacik={queues.medicineRacik} queuesNonRacik={queues.medicineNonRacik} innerRefNonRacik={medicineRefNonRacik} innerRefRacik={medicineRefRacik} bgColor="bg-yellow-600" />

        {/* Antrean Pengambilan Obat */}
       
        <QueueSectionVerification title="Obat Telah Selesai" queues={queues.pickupQueue} innerRef={pickupRef} bgColor="bg-green-700"/>
      </div>
    </div>
  );
};

export default NextQueue;
