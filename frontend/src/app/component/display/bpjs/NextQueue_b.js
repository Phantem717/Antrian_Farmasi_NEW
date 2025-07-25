import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import { getSocket } from "@/app/utils/api/socket";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { queue } from "jquery";

const NextQueue = ({location, verificationData, medicineData, pickupData }) => {
    const socket = getSocket(); // Ensure this returns a singleton socket instance

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
const [times, setTimes] = useState({
  verifTime: 10,
  processTimeNon: 10,
   processTimeRacik: 10,
  pickupTimeNon: 10,
  pickupTimeRacik: 10
});    
  function calculateTime(verifLength,processLengthNon, processLengthRacik, pickupLengthNon, pickupLengthRacik) {
  const verifTime = verifLength < 3 ? 10 : verifLength * 10;
  const processTimeNon = processLengthNon < 3 ? 10 : (processLengthNon * 10);
  const processTimeRacik =processLengthRacik< 3 ? 10 : (processLengthRacik * 10)
  const pickupTimeNon = pickupLengthNon < 3 ? 10 : (pickupLengthNon * 10);
  const pickupTimeRacik = pickupLengthRacik < 3 ? 10 : (pickupLengthRacik * 10);
  return { verifTime, processTimeNon,processTimeRacik, pickupTimeNon,pickupTimeRacik };
}

useEffect(() => {
  if (!socket) return; // Exit if socket is not initialized

  const handleGetResponses = (payload) => {
    console.log("? GOT RESP", payload);

    const dateString = new Date().toISOString().split('T')[0];

    // Process verificationData
    const verificationData = payload.data.verificationData
      .sort((a, b) => (
        new Date(a.waiting_verification_stamp) - new Date(b.waiting_verification_stamp)
      ))
      .map(task => ({
        queueNumber: task.queue_number,
        type: task.status_medicine,
        status: task.status === "waiting_verification" ? "Menunggu"
          : task.status === "called_verification" ? "Dipanggil"
          : task.status === "pending_verification" ? "Terlewat"
          : task.status === "recalled_verification" ? "Dipanggil"
          : task.status === "processed_verification" ? "Verifikasi"
          : "-",
        patient_name: task.patient_name
      }));

    // Process medicineData
    const medicineData = payload.data.medicineData
      .map(task => ({
        queueNumber: task.queue_number,
        type: task.status_medicine,
        status: task.status,
        patient_name: task.patient_name
      }));

    // Process pickupData
    const pickupData = payload.data.pickupData
      .map(task => ({
        queueNumber: task.queue_number,
        type: task.status_medicine,
        patient_name: task.patient_name,
        isYesterday: new Date(new Date(task.waiting_pickup_medicine_stamp).setHours(0,0,0,0)) == 
                     new Date(new Date().setHours(0,0,0,0) - 86400000),
        status: task.status === "waiting_pickup_medicine" ? "Menunggu"
          : task.status === "called_pickup_medicine" ? "Dipanggil"
          : task.status === "pending_pickup_medicine" ? "Terlewat"
          : task.status === "recalled_pickup_medicine" ? "Dipanggil"
          : "-",
      }));

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

    // Calculate and set time estimates
    const newTimes = calculateTime(
      verificationData.length,
      medicineData.filter(task => task.type === "Non - Racikan").length,
      medicineData.filter(task => task.type === "Racikan").length,
      pickupData.filter(task => task.type === "Non - Racikan").length,
      pickupData.filter(task => task.type === "Racikan").length
    );
    setTimes(newTimes);
  };

  // Set up listener
  socket.on('get_responses', handleGetResponses);

  // Request initial data
  socket.emit('get_initial_responses', { location });

  // Cleanup
  return () => {
    socket.off('get_responses', handleGetResponses);
  };
}, [socket, location]); // Re-run if `socket` or `location` changes
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
 const QueueSection = ({ title, queuesRacik, queuesNonRacik, bgColor }) => {
  const renderQueueItems = (queues, isRacikan = true) => {
    if (queues.length === 0) {
      return (
        <div className="bg-white text-black p-4 shadow text-center font-bold text-2xl w-full">
          Belum Ada Antrian
        </div>
      );
    }

    return queues.map((queue, index) => (
      <div
        key={`${queue.queueNumber}-${index}-${isRacikan ? 'racik' : 'nonracik'}`}
        className="bg-white text-green-700 text-6xl font-extrabold p-4 shadow border-2 border-black rounded w-full"
        style={{ 
          height: '160px',
          marginBottom: '8px',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div className="text-center text-6xl w-full leading-none">
          {queue.queueNumber}
        </div>
        <div className="mt-2 w-full bg-green-400 px-4 py-2 text-black text-center text-3xl truncate whitespace-nowrap overflow-hidden leading-tight">
          {queue.patient_name}
        </div>
      </div>
    ));
  };

  const renderMarqueeSection = (queues, duration, isRacikan) => {
    return (
      <Marquee
        direction="up"
        pauseOnHover
        style={{
          width: '100%',
          marginTop: 20,
          marginBottom: 10,
          '--duration': `${duration}s`,
          height: '1030px'
        }}
      >
        <div className="w-full flex flex-col items-center justify-center">
          {renderQueueItems(queues, isRacikan)}
        </div>
      </Marquee>
    );
  };

  return (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md overflow-hidden`} style={{ minHeight: "1200px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
      
      <div className="flex gap-4 mt-4 flex-wrap">
        {/* Racikan Section */}
        <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md overflow-hidden">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
          {queuesRacik.length > 4 ? 
            renderMarqueeSection(queuesRacik, times.processTimeRacik, true) :
            <div className="w-full flex flex-col items-center " style={{ height: '1030px', overflowY: 'auto' }}>
              {renderQueueItems(queuesRacik, true)}
            </div>
          }
        </div>

        {/* Non-Racikan Section */}
        <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md overflow-hidden">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
          {queuesNonRacik.length > 4 ? 
            renderMarqueeSection(queuesNonRacik, times.processTimeNon, false) :
            <div className="w-full flex flex-col items-center " style={{ height: '1030px', overflowY: 'auto' }}>
              {renderQueueItems(queuesNonRacik, false)}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

 const QueueSectionVerification = ({ title, queues, bgColor }) => {
  const renderQueueItems = () => {
    if (queues.length === 0) {
      return (
        <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">
          Belum Ada Antrian
        </div>
      );
    }

    return queues.map((queue, index) => (
      <div 
        key={`${queue.queueNumber}-${index}`}
        className="flex items-center flex-col justify-between bg-white text-green-700 text-6xl font-extrabold p-4 shadow text-center border-2 border-black rounded w-full"
      >
        <div className="flex flex-row gap-5 justify-around w-full h-1/6">
          <div className={`flex-1 text-4xl text-left items-middle ${getStatusColor(queue.status)}`}>
            {queue.queueNumber}
          </div>
          <div className={`flex-1 text-3xl text-center ${getStatusColor(queue.status)}`}>
            {queue.type}
          </div>
          <div className={`flex-1 text-3xl text-right ${getStatusColor(queue.status)}`}>
            {queue.status}
          </div>
        </div>
        <div className={`flex-1 text-4xl text-center bg-green-400 mt-2 w-full p-1 text-black`}>
          {queue.patient_name}
        </div>
      </div>
    ));
  };

  return (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ height: "1180px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
      <div className="flex gap- mt-2">
        <div className="bg-white p-2 rounded-md shadow-md w-full h-full">
          {queues.length > 5 ? (
            <Marquee 
              fade={false} 
              direction="up"
              className="gap-[3rem]" 
              innerClassName="gap-[3rem] [--gap:3rem]"
              style={{ '--duration': `${times.verifTime}s`, height: `1100px` }}
            >
              <div className="w-full">
                {renderQueueItems()}
              </div>
            </Marquee>
          ) : (
            <div className="w-full" style={{ height: '1100px', overflowY: 'auto' }}>
              {renderQueueItems()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const QueueSectionPickup = ({ title, queuesRacik, queuesNonRacik, bgColor }) => (
  <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "1200px" }}>
    <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
    <div className="flex flex-wrap gap-2 mt-2 overflow-x-hidden">
      {/* Racikan */}
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md" style={{height: `1120px`}}>
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
        <div className="bg-white rounded-md p-2">
          {queuesRacik.length > 0 ? (
              <Marquee fade={true} direction="up" className="gap-[3rem]" innerClassName="gap-[3rem] [--gap:3rem]"       
              style={{ '--duration': `${times.pickupTimeRacik}s`,     height: `1060px` // Dynamic height
}} 
>
              <div className="flex flex-col gap-2">
                {queuesRacik.map((queue, index) => (
                  <div
                    key={index}
                    className={`uppercase bg-white p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
                    style={{ minHeight: "140px" }}
                  >
                    <div className="flex flex-col font-extrabold">
                      {queue.isYesterday && 
                      (
                       <div className={`text-2xl ${getStatusColor(queue.status)}`}>KEMARIN</div>
                      )
                      }
                      <div className={`text-4xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
                    <div className={`text-3xl ${getStatusColor(queue.status)}`}>{queue.status}</div>
                    </div>
                      <div className="text-center mt-2 w-full bg-green-400 px-4 py-2 text-black text-3xl truncate whitespace-nowrap overflow-hidden leading-tight">
{queue.patient_name}</div>
                    
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
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md" style={{height: `1120px`}}>
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
        <div className="bg-white rounded-md p-2" style={{ height: "1000px" }}>
          {queuesNonRacik.length > 0 ? (
            <Marquee
              direction="up"
             className="gap-[3rem]" innerClassName="gap-[3rem] [--gap:3rem]"              
              style={{ '--duration': `${times.pickupTimeNon}s`, height: `1060px`}}

            >
              <div className="flex flex-col gap-2">
                {queuesNonRacik.map((queue, index) => (
                  <div
                    key={index}
                    className={`uppercase bg-white p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
                    style={{ minHeight: "140px" }}
                  >
                   <div className="flex flex-col font-extrabold">
                     {queue.isYesterday && 
                      (
                       <div className={`text-2xl ${getStatusColor(queue.status)}`}>KEMARIN</div>
                      )
                      }
                      <div className={`text-4xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
                    <div className={`text-3xl ${getStatusColor(queue.status)}`}>{queue.status}</div>
                    </div>
                      <div className="text-center text-bold mt-2 w-full bg-green-400 px-4 py-2 text-black text-3xl truncate whitespace-nowrap overflow-hidden leading-tight">
{queue.patient_name}</div>
                    
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
   <div className="bg-white p-4 shadow-lg border border-green-700 w-full "  style={{ minHeight: "300px" }}>
      <div className="flex w-full gap-4 flex-wrap justify-center">
        <QueueSectionVerification 
          title="Proses Pengecekan Ketersediaan Obat" 
          queues={queues.verificationQueue} 
          bgColor="bg-green-700"
        />

        <QueueSection 
          title="Proses Penyiapan Obat" 
          queuesRacik={queues.medicineRacik} 
          queuesNonRacik={queues.medicineNonRacik}        
          bgColor="bg-yellow-600" 
        />

      </div>
    </div>
  );
};

export default NextQueue;