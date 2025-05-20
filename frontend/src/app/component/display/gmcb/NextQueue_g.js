import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import {getSocket} from "@/app/utils/api/socket";
const NextQueue_g = ({verificationData, medicineData, pickupData}) => {
  // State untuk menyimpan antrian dari API
  const [queues, setQueues] = useState({
    nextQueueRacik: [],
    nextQueueNonRacik: [],
    medicineRacik: [],
    medicineNonRacik: [],
    pickupRacik: [],
    pickupNonRacik: [],
  });

  // Refs untuk auto-scroll
  const nextQueueRef = useRef(null);
  const medicineRef = useRef(null);
  const pickupRef = useRef(null);

  // Fungsi Auto-scroll
  const autoScroll = (ref) => {
    if (!ref.current) return;
    const scrollSpeed = 1;
    const delayBeforeReset = 2000;

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
    autoScroll(nextQueueRef);
    autoScroll(medicineRef);
    autoScroll(pickupRef);
  }, [queues]);

  // 🔄 Ambil data antrian dari API saat komponen pertama kali di-load
  useEffect(() => {
    const socket = getSocket();
    const fetchQueues = async () => {
      try {
        // Fetch Verifikasi (Status: waiting_verification)
        socket.on('get_responses',(payload)=>{
          const verificationData = payload.data.verificationData.filter(task => task.status === "waiting_verification")
          .map(task => ({
            queueNumber: task.queue_number,
            // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
                        type: task.status_medicine ,
  
          }));;
          console.log("VERFIDATA",verificationData);;

          const medicineData = payload.data.medicineData.filter(task => task.status === "waiting_medicine")
          .map(task => ({
            queueNumber: task.queue_number,
            // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
                        type: task.status_medicine ,

          }));
          console.log("MEDS",medicineData);

          const pickupData = payload.data.pickupData.filter(task => task.status === "waiting_pickup_medicine")
          .map(task => ({
            queueNumber: task.queue_number,
            // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
            type: task.status_medicine ,

          }));
          console.log("PICKUP",pickupData);
          setQueues({
            nextQueueRacik: verificationData.filter(task => task.type === "Racikan"),
            nextQueueNonRacik: verificationData.filter(task => task.type === "Non - Racikan"),
            medicineRacik: medicineData.filter(task => task.type === "Racikan"),
            medicineNonRacik: medicineData.filter(task => task.type === "Non - Racikan"),
            pickupRacik: pickupData.filter(task => task.type === "Racikan"),
            pickupNonRacik: pickupData.filter(task => task.type === "Non - Racikan"),
          });
    
        });
        // const verificationResponse = await VerificationAPI.getAllVerificationTasks()
        // console.log("Verification Data:", verificationResponse.data);

        // const verificationData = verificationResponse.data
        // .filter(task => task.status === "waiting_verification")
        // .map(task => ({
        //   queueNumber: task.queue_number,
        //   // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
        //               type: task.status_medicine ,

        // }));
        // console.log("VERFIDATA",verificationData);

  
        // Fetch Medicine (Status: waiting_medicine)
        // const medicineResponse = await MedicineAPI.getAllMedicineTasks();
        // const medicineData = medicineResponse.data
        //   .filter(task => task.status === "waiting_medicine")
        //   .map(task => ({
        //     queueNumber: task.queue_number,
        //     // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
        //                 type: task.status_medicine ,

        //   }));
        //   console.log("MEDS",medicineData);

        // Fetch Pickup (Status: waiting_pickup_medicine)
        // const pickupResponse = await PickupAPI.getAllPickupTasks();
        // const pickupData = pickupResponse.data
        //   .filter(task => task.status === "waiting_pickup_medicine")
        //   .map(task => ({
        //     queueNumber: task.queue_number,
        //     // type: task.status_medicine === "Tidak ada Racikan" ? "Non - Racikan" : "Racikan",
        //     type: task.status_medicine ,

        //   }));
        //   console.log("PICKUP",pickupData);
        // Set state with updated data based on `status_medicine`
      
      } catch (error) {
        console.error("? Error fetching queue data:", error);
      }
    };
  
    fetchQueues();
  }, []);
  

  // Komponen untuk Setiap Kategori Antrian
  const QueueSection = ({ title, queuesRacik, queuesNonRacik, innerRef, bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "180px" }}>
      <p className="text-2xl font-bold text-white text-center">{title}</p>

      <div className="flex gap-2 mt-2">
        {/* Racikan */}
        <div className="flex-1 bg-white p-2 rounded-md shadow-md">
          <p className="text-lg font-semibold text-center text-green-700">Racikan</p>
          <div
            className="scrollable-table overflow-y-auto scrollbar-hide bg-white rounded-md p-2"
            ref={innerRef}
            style={{ maxHeight: "115px" }}
          >
            {queuesRacik.length > 0 ? (
              queuesRacik.map((queue, index) => (
                <span
                  key={index}
                  className="bg-white text-green-700 text-3xl p-2 shadow text-center font-bold border border-gray-300 rounded block mb-1"
                >
                  {queue.queueNumber}
                </span>
              ))
            ) : (
              <span className="bg-white text-green-700 p-2 shadow text-center font-bold text-2xl block">
                Belum Ada Antrian
              </span>
            )}
          </div>
        </div>

        {/* Non-Racikan */}
        <div className="flex-1 bg-white p-2 rounded-md shadow-md">
          <p className="text-lg font-semibold text-center text-green-700">Non-Racikan</p>
          <div
            className="scrollable-table overflow-y-auto scrollbar-hide bg-white rounded-md p-2"
            ref={innerRef}
            style={{ maxHeight: "115px" }}
          >
            {queuesNonRacik.length > 0 ? (
              queuesNonRacik.map((queue, index) => (
                <span
                  key={index}
                  className="bg-white text-green-700 text-3xl p-2 shadow text-center font-bold border border-gray-300 rounded block mb-1"
                >
                  {queue.queueNumber}
                </span>
              ))
            ) : (
              <span className="bg-white text-green-700 p-2 shadow text-center font-bold text-2xl block">
                Belum Ada Antrian
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 shadow-lg border border-green-700 w-full">
      <div className="w-full mb-4">
        <h2 className="text-3xl font-bold text-green-700 text-center">Antrian Selanjutnya</h2>
      </div>

      <div className="flex w-full gap-4 flex-wrap justify-center">
        {/* Antrean Selanjutnya */}
        <QueueSection title="Antrean Verifikasi" queuesRacik={queues.nextQueueRacik} queuesNonRacik={queues.nextQueueNonRacik} innerRef={nextQueueRef} bgColor="bg-green-700" />

        {/* Proses Pembuatan Obat */}
        <QueueSection title="Proses Pembuatan Obat" queuesRacik={queues.medicineRacik} queuesNonRacik={queues.medicineNonRacik} innerRef={medicineRef} bgColor="bg-yellow-600" />

        {/* Antrean Pengambilan Obat */}
        <QueueSection title="Antrean Pengambilan Obat" queuesRacik={queues.pickupRacik} queuesNonRacik={queues.pickupNonRacik} innerRef={pickupRef} bgColor="bg-green-700" />
      </div>
    </div>
  );
};

export default NextQueue_g;
