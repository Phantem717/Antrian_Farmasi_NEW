import { useEffect, useRef, useState } from "react";
import VerificationAPI from "../../utils/api/Verification";
import MedicineAPI from "../../utils/api/Medicine";
import PickupAPI from "../../utils/api/Pickup";
import {getSocket} from "@/app/utils/api/socket";
import Marquee from "react-fast-marquee";

const NextQueue = ({ verificationData, medicineData, pickupData }) => {
  const [queues, setQueues] = useState({
    nextQueueRacik: [],
    nextQueueNonRacik: [],
    medicineRacik: [],
    medicineNonRacik: [],
    pickupRacik: [],
    pickupNonRacik: [],
    verificationQueue: []
  });

  const [isScrolling, setIsScrolling] = useState(false);

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
            type: task.status_medicine ,
          }));
          console.log("VERFIDATA",verificationData);;

          const medicineData = payload.data.medicineData.filter(task => task.status === "waiting_medicine")
          .map(task => ({
            queueNumber: task.queue_number,
            type: task.status_medicine ,
          }));
          console.log("MEDS",medicineData);

          const pickupData = payload.data.pickupData.filter(task => task.status === "waiting_pickup_medicine")
          .map(task => ({
            queueNumber: task.queue_number,
            type: task.status_medicine ,
          }));

          console.log("PICKUP",pickupData);

          setQueues({
            verificationQueue: verificationData,
            medicineRacik: medicineData.filter(task => task.type === "Racikan"),
            medicineNonRacik: medicineData.filter(task => task.type === "Non - Racikan"),
            pickupRacik: pickupData.filter(task => task.type === "Racikan"),
            pickupNonRacik: pickupData.filter(task => task.type === "Non - Racikan"),
          });
        });
       
      } catch (error) {
        console.error("? Error fetching queue data:", error);
      }
    };
  
    fetchQueues();
  }, []);
  

  // Komponen untuk Setiap Kategori Antrian
  const QueueSection = ({ title, queuesRacik, queuesNonRacik, bgColor }) => (
  <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "180px" }}>
    <p className="text-2xl font-bold text-white text-center">{title}</p>
    
    <div className="flex gap-2 mt-2">
      {/* Racikan */}
      <div className="flex-1 bg-white p-2 rounded-md shadow-md">
        <p className="text-lg font-semibold text-center text-green-700">Racikan</p>
        <div className="bg-white rounded-md p-2 overflow-hidden" style={{ height: "115px" }}>
          {queuesRacik.length > 0 ? (
            <Marquee direction="up" speed={50} height={115} pauseOnHover>
              {queuesRacik.map((queue, index) => (
                <div key={index} className="bg-white text-green-700 text-3xl p-2 text-center font-bold border border-gray-300 rounded mb-1">
                  {queue.queueNumber}
                </div>
              ))}
            </Marquee>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-green-700 text-2xl font-bold">
                Belum Ada Antrian
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Non-Racikan */}
      <div className="flex-1 bg-white p-2 rounded-md shadow-md">
        <p className="text-lg font-semibold text-center text-green-700">Non-Racikan</p>
        <div className="bg-white rounded-md p-2 overflow-hidden" style={{ height: "115px" }}>
          {queuesNonRacik.length > 0 ? (
            <Marquee direction="up" speed={50} width={200} height={115} pauseOnHover>
              {queuesNonRacik.map((queue, index) => (
                <div key={index} className="bg-white text-green-700 text-3xl p-2 text-center font-bold border border-gray-300 rounded mb-1">
                  {queue.queueNumber}
                </div>
              ))}
            </Marquee>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-green-700 text-2xl font-bold">
                Belum Ada Antrian
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
  const QueueSectionVerification = ({ title, queues, bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "500px" }}>
      <p className="text-2xl font-bold text-white text-center">{title}</p>
  
      <div className="flex gap-2 mt-2">
        {/* Verifikasi */}
        <div className="flex-1 bg-white rounded-md shadow-md p-2">
          <p className="text-lg font-semibold text-center text-green-700">Verifikasi</p>
  
          <div
            className="overflow-y-auto scrollbar-hide p-2 rounded-md"
            style={{ maxHeight: "115px" }}
          >

            {queues.length > 0 ? (
              queues.map((queue, index) => (
                <span
                  key={index}
                  className="bg-white text-green-700 text-3xl p-2 shadow text-center font-bold border border-gray-300 rounded block mb-1"
                >
                  {queue.queueNumber}
                </span>
              ))
            ) : (
              <span className="text-green-700 p-2 text-center font-bold text-2xl block">
                Belum Ada Antrian
              </span>
            )}

          </div>
        </div>
  
        {/* Future "Non-Racikan" section goes here with same `flex-1` */}
      </div>
    </div>
  );
  

  return (
    <div className="bg-white p-4 shadow-lg border border-green-700 w-full">
      <div className="w-full mb-4">
        <h2 className="text-3xl font-bold text-green-700 text-center">Antrian Selanjutnya</h2>
      </div>

      <div className="flex w-full gap-4 flex-wrap justify-center">
        <QueueSectionVerification title="Antean Verifikasi" queues={queues.verificationQueue}  bgColor="bg-green-700"/>
        {/* Antrean Selanjutnya */}
        {/* <QueueSection title="Antrean Verifikasi" queuesRacik={queues.nextQueueRacik} queuesNonRacik={queues.nextQueueNonRacik} innerRef={nextQueueRef} bgColor="bg-green-700" /> */}

        {/* Proses Pembuatan Obat */}
        <QueueSection title="Proses Pembuatan Obat" queuesRacik={queues.medicineRacik} queuesNonRacik={queues.medicineNonRacik}  bgColor="bg-yellow-600" />

        {/* Antrean Pengambilan Obat */}
        <QueueSection title="Antrean Pengambilan Obat" queuesRacik={queues.pickupRacik} queuesNonRacik={queues.pickupNonRacik}  bgColor="bg-green-700" />
      </div>
    </div>
  );
};

export default NextQueue;
