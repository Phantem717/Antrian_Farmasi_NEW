import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import { getSocket } from "@/app/utils/api/socket";
import Marquee from "react-fast-marquee";

const NextQueue = ({ verificationData, medicineData, pickupData }) => {
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
  // Fetch queue data
    const socket = getSocket();

    useEffect(()=>{
 socket.on('get_responses', (payload) => {
          const dateString = new Date().toISOString().split('T')[0];
        console.log("GOT RESP");

        console.log("ORIGINAL DATA",payload.data);
          // Process verification data
          const verificationData = payload.data.verificationData
  .filter(task => task && task.status && task.waiting_verification_stamp)
  .filter(task => {
    const stamp = typeof task.waiting_verification_stamp === 'string' 
      ? new Date(task.waiting_verification_stamp) 
      : task.waiting_verification_stamp;

    // Filter for tasks where the queue_number starts with "RC" or "NR"
    return (task.queue_number.startsWith("RC") || task.queue_number.startsWith("NR")) && 
      task.status.includes("verification") && 
      stamp.toISOString().split('T')[0] === dateString;
  })
  .map(task => ({
    queueNumber: task.queue_number,
    type: task.status_medicine,
    status: task.status === "waiting_verification" ? "Menunggu" 
      : task.status === "called_verification" ? "Dipanggil" 
      : task.status === "pending_verification" ? "Terlewat" 
      : task.status === "recalled_verification" ? "Dipanggil"
      : task.status === "processed_verification" ? "Verifikasi"
      : "-"
  }));

          const medicineData = payload.data.medicineData
            .filter(task => task && task.status && task.waiting_medicine_stamp)
            .filter(task => {
              const stamp = typeof task.waiting_medicine_stamp === 'string' 
                ? new Date(task.waiting_medicine_stamp) 
                : task.waiting_medicine_stamp;
              return task.status.includes("waiting_medicine") && 
                stamp.toISOString().split('T')[0] === dateString;
            })
            .map(task => ({
              queueNumber: task.queue_number,
              type: task.status_medicine,
              status: task.status
            }));

          // Process pickup data
          const pickupData = payload.data.pickupData
            .filter(task => task && task.status && task.waiting_pickup_medicine_stamp)
            .filter(task => {
              const stamp = typeof task.waiting_pickup_medicine_stamp === 'string' 
                ? new Date(task.waiting_pickup_medicine_stamp) 
                : task.waiting_pickup_medicine_stamp;
              return task.status.includes("pickup") && 
                task.status !== "completed_pickup_medicine" && 
                stamp.toISOString().split('T')[0] === dateString;
            })
            .map(task => ({
              queueNumber: task.queue_number,
              type: task.status_medicine,
              status: task.status === "waiting_pickup_medicine" ? "Menunggu" 
                : task.status === "called_pickup_medicine" ? "Dipanggil" 
                : task.status === "pending_pickup_medicine" ? "Terlewat" 
                : task.status === "recalled_pickup_medicine" ? "Dipanggil"
                : "-"
            }));

            console.log("DATA",pickupData,verificationData,medicineData)
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
    },[socket]);
    


  // Status color helpers
  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu': return 'text-yellow-600';
      case 'Dipanggil': return 'text-green-600';
      case 'Terlewat': return 'text-red-600';
      case 'Verifikasi': return 'text-blue-600';
      default: return 'text-black';
    }
  };

  const getStatusColourBorder = (status) => {
    switch(status) {
      case 'Menunggu': return 'border-2 border-yellow-500';
      case 'Dipanggil': return 'border-2 border-green-500';
      case 'Terlewat': return 'border-2 border-red-500';
      case 'Verifikasi': return 'border-2 border-blue-500';
      default: return '';
    }
  };

  // Queue section components
  const QueueSection = ({ title, queuesRacik, queuesNonRacik, bgColor }) => (
  <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md overflow-hidden`} style={{ minHeight: "300px" }}>
    <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
    
    <div className="flex gap-4 mt-4 flex-wrap">
      
      {/* Racikan Section */}
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md overflow-hidden">
        <p className="text-2xl font-extrabold text-center text-green-500 uppercase">Racikan</p>

        <Marquee
          direction="up"
          pauseOnHover
          gradient={false}
          className="overflow-hidden"
          style={{
            height: 700,
            width:'100%',
            marginTop: 20,
            marginBottom: 10,
           
          }}
        >
          <div className="w-full">
            {queuesRacik.length > 0 ? (
              queuesRacik.map((queue, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center bg-white text-green-700 text-6xl font-extrabold p-4 shadow border border-gray-300 rounded w-full"
                  style={{ height: '120px', marginBottom: '8px' }}
                >
                  {queue.queueNumber}
                </div>
              ))
            ) : (
              <div className="bg-white text-black p-4 shadow text-center font-bold text-2xl w-full">
                Belum Ada Antrian
              </div>
            )}
          </div>
        </Marquee>
      </div>

      {/* Non-Racikan Section */}
      <div className="flex-1 bg-white p-2 rounded-md shadow-md overflow-hidden ">
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>

       <Marquee
  direction="up"
  pauseOnHover
  gradient={false}
  style={{
            width:700,
    marginTop: 20,
    marginBottom: 10,
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    alignSelf:'flex-start'
  }}
>
  <div className="w-full flex flex-start items-start flex-col items-end">
    {queuesNonRacik.length > 0 ? (
      queuesNonRacik.map((queue, index) => (
        <div
          key={index}
          className="flex items-start justify-start bg-white text-green-700 text-6xl font-extrabold p-4 shadow border border-gray-300 rounded w-full"
          style={{ height: '120px', marginBottom: '8px' }}
        >
          {queue.queueNumber}
        </div>
      ))
    ) : (
      <div className="bg-white text-black p-4 shadow text-center font-bold text-2xl w-full">
        Belum Ada Antrian
      </div>
    )}
  </div>
</Marquee>

      </div>
    </div>
  </div>
);


  const QueueSectionVerification = ({ title, queues,bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "300px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
      <div className="flex gap-2 mt-2">
        <div className="bg-white p-2 rounded-md shadow-md w-full h-full">
               <Marquee
              direction="up"
              gradient={false}
              style={{
                height: 700,   
                width: '100%',        // Tinggi tampilan marquee
                overflow: 'hidden',
                           alignSelf: 'flex-start', // This forces top alignment

           
              }}
            >
    <div className="w-full ">
           
            {queues.length > 0 ? (
              queues.map((queue, index) => (
                <div key={index}            
                 className="flex items-center justify-start bg-white text-green-700 text-6xl font-extrabold p-4 shadow text-center border border-gray-300 rounded w-full"
>
            
                  <div className={`flex-1 text-4xl text-left ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
                  <div className={`flex-1 text-3xl text-center ${getStatusColor(queue.status)}`}>{queue.type}</div>
                  <div className={`flex-1 text-3xl text-right ${getStatusColor(queue.status)}`}>{queue.status}</div>

                </div>
                
              ))
              
            ) : (
              <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">Belum Ada Antrian</div>
            )}
            
          </div>
          </Marquee>
        </div>
      </div>
    </div>
  );
const QueueSectionPickup = ({ title, queuesRacik, queuesNonRacik, bgColor }) => (
  <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "300px" }}>
    <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
    <div className="flex flex-wrap gap-2 mt-2 overflow-x-hidden">
      {/* Racikan */}
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md">
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
        <div className="bg-white rounded-md p-2" style={{ height: "800px" }}>
          {queuesRacik.length > 0 ? (
            <Marquee
              direction="up"
              gradient={false}
              style={{ height: "100%" }}
            >
              <div className="flex flex-col gap-2">
                {queuesRacik.map((queue, index) => (
                  <div
                    key={index}
                    className={`uppercase bg-white p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
                    style={{ minHeight: "120px" }}
                  >
                    <div className={`text-4xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
                    <div className={`text-3xl ${getStatusColor(queue.status)}`}>{queue.status}</div>
                  </div>
                ))}
              </div>
            </Marquee>
          ) : (
            <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl h-full flex items-center justify-center">
              Belum Ada Antrian
            </div>
          )}
        </div>
      </div>

      {/* Non-Racikan */}
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md">
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
        <div className="bg-white rounded-md p-2" style={{ height: "800px" }}>
          {queuesNonRacik.length > 0 ? (
            <Marquee
              direction="up"
              pauseOnHover
              gradient={false}
              style={{ height: "100%" }}
            >
              <div className="flex flex-col gap-2">
                {queuesNonRacik.map((queue, index) => (
                  <div
                    key={index}
                    className={`uppercase bg-white p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
                    style={{ minHeight: "120px" }}
                  >
                    <div className={`text-4xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
                    <div className={`text-3xl ${getStatusColor(queue.status)}`}>{queue.status}</div>
                  </div>
                ))}
              </div>
            </Marquee>
          ) : (
            <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl h-full flex items-center justify-center">
              Belum Ada Antrian
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
  return (
   <div className="bg-white p-4 shadow-lg border border-green-700 w-full">
      <div className="flex w-full gap-4 flex-wrap justify-center">
        <QueueSectionVerification 
          title="Proses Verifikasi" 
          queues={queues.verificationQueue} 
          bgColor="bg-green-700"
        />

        <QueueSection 
          title="Proses Pembuatan Obat" 
          queuesRacik={queues.medicineRacik} 
          queuesNonRacik={queues.medicineNonRacik} 
       
          bgColor="bg-yellow-600" 
        />

        <QueueSectionPickup 
          title="Obat Telah Selesai" 
          queuesRacik={queues.pickupRacik} 
          queuesNonRacik={queues.pickupNonRacik} 
      
          bgColor="bg-green-700" 
        />
      </div>
    </div>
  );
};

export default NextQueue;