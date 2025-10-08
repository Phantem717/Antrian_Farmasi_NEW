import { useEffect, useRef, useState,useMemo } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import { getSocket } from "@/app/utils/api/socket";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { queue } from "jquery";
import { Carousel } from "antd";

const NextQueue = ({location, verificationData, medicineData, pickupData }) => {
    const socket = getSocket(); // Ensure this returns a singleton socket instance
    console.log("LOCATION",location);
    const [currentDate, setCurrentDate] = useState(new Date().toDateString()); // [currentDate,setCurrentDate]
  const [hideName, setHideName] = useState(true);
  console.log(hideName)
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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedValue = window.localStorage.getItem('nameToggleState');
      setHideName(storedValue === 'true');
    }
  }, []);

  function calculateTime(verifLength, processLengthNon, processLengthRacik, pickupLengthNon, pickupLengthRacik) {
  // Divide all multipliers by 2 for faster speed
  const verifTime = verifLength < 3 ? 5 : Math.floor(verifLength * 0.5);
  const processTimeNon = processLengthNon < 3 ? 5 : (Math.floor(processLengthNon * 0.5));
  const processTimeRacik = processLengthRacik < 3 ? 5 : (Math.floor(processLengthRacik * 0.5));
  const pickupTimeNon = pickupLengthNon < 3 ? 5 : (Math.floor(pickupLengthNon * 0.5));
  const pickupTimeRacik = pickupLengthRacik < 3 ? 5 : (Math.floor(pickupLengthRacik * 0.5));
  return { verifTime, processTimeNon, processTimeRacik, pickupTimeNon, pickupTimeRacik };
}

useEffect(() => {
  if (!socket) return; // Exit if socket is not initialized
socket.on('send_nameToggle', (payload) => {
  console.log("TOGGLE NAME",payload);
  if (hideName !== payload.data) {  // Only refresh if state actually changed
    setHideName(payload.data);
    localStorage.setItem('nameToggleState', payload.data.toString());
    window.location.reload();
  }


return () => {
  socket.off('send_nameToggle', handleToggleName);
  socket.off('get_responses', handleGetResponses);
  socket.off('insert_appointment', handleGetResponses);
};
});
  
  const handleGetResponses = (payload) => {
    console.log("? GOT RESP", payload);

    const dateString = new Date().toISOString().split('T')[0];

    // Process verificationData
    const verificationData = payload.data.verificationData
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
  socket.on('insert_appointment', handleGetResponses);

  // Request initial data
  socket.emit('get_initial_responses', { location }, console.log("GET INITIAL DATA"));

  // Cleanup
  return () => {
    socket.off('get_responses', handleGetResponses);
      socket.off('insert_appointment', handleGetResponses);

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


  
useEffect(() => {
  const interval = setInterval(() => {
    const today = new Date().toDateString();
    console.log("DATE",today,currentDate);
    if (currentDate !== today) {
  window.location.reload();
}
  }, 300000); // check every 5 mins

  return () => clearInterval(interval);
}, []);
  

  // Queue section components
 const QueueSection = ({ title, queuesRacik, queuesNonRacik, bgColor }) => {
  
  const chunkArray = (arr, size) => {
    return arr.reduce((chunks, item, i) => {
      if (i % size === 0) {
        chunks.push([item]);
      } else {
        chunks[chunks.length - 1].push(item);
      }
      return chunks;
    }, []);
  };
  
  // ✅ Memoize so chunks are stable and don't reset carousel
  const chunkedRacik = useMemo(() => chunkArray(queuesRacik, 5), [queuesRacik]);
  const chunkedNonRacik = useMemo(() => chunkArray(queuesNonRacik, 5), [queuesNonRacik]);
  
  const renderMarqueeSectionMedicine = (chunkedQueues, duration, isRacikan = true) => (
    <Carousel
      autoplay
      autoplaySpeed={5000}
      dots
      infinite={true}
      slidesToShow={1}
      draggable={false}
      adaptiveHeight={false}
      className="gap-[3rem]"
      style={{ "--duration": `${duration}s`, height: "1060px", width: "100%" }}
    >
      {chunkedQueues.map((group, groupIndex) => (
        <div key={`group-${groupIndex}-${group.map(q => q.queueNumber).join("_")}`}>
          <div style={{ height: "1060px", textAlign: "center" }}>
            <div className="flex flex-col gap-2">
              {/* ✅ Pass the entire group (array), not individual queue */}
              {renderQueueItems(group, isRacikan)}
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
  
  // ✅ Renamed parameter to queueList for clarity
  const renderQueueItems = (queueList, isRacikan = true) => {
    if (!queueList || queueList.length === 0) {
      return (
        <div className="bg-gray-100 text-black p-4 shadow text-center font-bold text-2xl w-full">
          Belum Ada Antrian
        </div>
      );
    }

    return queueList.map((queue, index) => (
      <div
        key={`${queue.queueNumber}-${index}-${isRacikan ? 'racik' : 'nonracik'}`}
        className="bg-gray-100 text-green-700 text-6xl font-extrabold p-4 shadow border-2 border-black rounded w-full"
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
          {/* ✅ Fixed hideName check */}
          {hideName ? hideNameAction(queue.patient_name) : queue.patient_name}
        </div>
      </div>
    ));
  };

  return (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md overflow-hidden`} style={{ minHeight: "1200px" }}>
      <p className="text-4xl font-extrabold text-white text-center uppercase">{title}</p>
      
      <div className="flex gap-4 mt-4 flex-wrap">
        {/* Racikan Section */}
        <div className="flex-1 min-w-[300px] bg-gray-100 p-2 rounded-md shadow-md overflow-hidden">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
          {queuesRacik.length > 5 ? 
            renderMarqueeSectionMedicine(chunkedRacik, times.processTimeRacik, true) :
            <div className="w-full flex flex-col items-center" style={{ height: '1030px', overflowY: 'auto' }}>
              {renderQueueItems(queuesRacik, true)}
            </div>
          }
        </div>

        {/* Non-Racikan Section */}
        <div className="flex-1 min-w-[300px] bg-gray-100 p-2 rounded-md shadow-md overflow-hidden">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
          {queuesNonRacik.length > 5 ? 
            renderMarqueeSectionMedicine(chunkedNonRacik, times.processTimeNon, false) :
            <div className="w-full flex flex-col items-center" style={{ height: '1030px', overflowY: 'auto' }}>
              {renderQueueItems(queuesNonRacik, false)}
            </div>
          }
        </div>
      </div>
    </div>
  );
};
function hideNameAction(name){
    if (!name) return "";

  return name
    .split(" ") // Split into words
    .map(word => {
      if (word.length <= 2) return word; // Keep short words as-is
      return word.slice(0, 2) + "*".repeat(word.length - 2); // Mask after 2 chars
    })
    .join(" "); // Rejoin into a single string
}



 const QueueSectionVerification = ({ title, queues, bgColor }) => {
  const chunkArray = (arr, size) => {
    return arr.reduce((chunks, item, i) => {
      if (i % size === 0) {
        chunks.push([item]);
      } else {
        chunks[chunks.length - 1].push(item);
      }
      return chunks;
    }, []);
  };
  
  const chunkedQueue = useMemo(() => chunkArray(queues, 5), [queues]);
  
  const renderMarqueeSection = (chunkedQueues, duration) => (
    <Carousel
      autoplay
      autoplaySpeed={5000}
      dots
      infinite={true}
      slidesToShow={1}
      draggable={false}
      adaptiveHeight={false}
      className="gap-[3rem]"
      style={{ "--duration": `${duration}s`, height: "1060px", width: "100%" }}
    >
      {chunkedQueues.map((group, groupIndex) => (
        <div key={`group-${groupIndex}-${group.map(q => q.queueNumber).join("_")}`}>
          <div style={{ height: "1060px", textAlign: "center" }}>
            <div className="flex flex-col gap-2">
              {/* ✅ Pass the group to renderQueueItems */}
              {renderQueueItems(group)}
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
  
  // ✅ Accept queueList parameter
  const renderQueueItems = (queueList = queues) => {
    if (!queueList || queueList.length === 0) {
      return (
        <div className="bg-gray-100 text-black p-2 shadow text-center font-bold text-2xl">
          Belum Ada Antrian
        </div>
      );
    }

    return queueList.map((queue, index) => (
      <div 
        key={`${queue.queueNumber}-${index}`}
        className="flex items-center flex-col justify-between bg-gray-100 text-green-700 text-6xl font-extrabold p-4 shadow text-center border-2 border-black rounded w-full"
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
          {/* ✅ Fixed hideName check */}
          {hideName ? hideNameAction(queue.patient_name) : queue.patient_name}
        </div>
      </div>
    ));
  };

  return (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ height: "1180px" }}>
      <p className="text-4xl font-extrabold text-white text-center uppercase">{title}</p>
      <div className="flex gap-2 mt-2">
        <div className="bg-gray-100 p-2 rounded-md shadow-md w-full h-full">
          {queues.length > 5 ? (
            renderMarqueeSection(chunkedQueue, times.verifTime)
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
  return (
   <div className="bg-gray-100 p-4 shadow-lg border border-green-700 w-full "  style={{ minHeight: "300px" }}>
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
