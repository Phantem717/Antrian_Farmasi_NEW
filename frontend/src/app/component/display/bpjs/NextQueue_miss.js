import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import { getSocket } from "@/app/utils/api/socket";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { queue } from "jquery";

const NextQueue = ({location, verificationData, medicineData, pickupData }) => {
    const [currentDate, setCurrentDate] = useState(new Date().getDate()); // [currentDate,setCurrentDate]
    const [hideName, setHideName] = useState(localStorage.getItem('nameToggleState')); // [hideName,setHideName]

  const [lastCalled, setLastCalled] = useState({
    racik: null,
    nonRacik: null
  });
  const [queues, setQueues] = useState({
    pickupRacik: [],
    pickupNonRacik: [],
    pickupTerlewatNonRacik: [],
    pickupTerlewatRacik: [],
    pickupQueue: []
  });

const [times, setTimes] = useState({
  processTimeNon: 10,
processTimeRacik: 10,
  pickupTimeNon: 10,
  pickupTimeRacik: 10
});    

const socket = getSocket();
 function calculateTime(processLengthNon, processLengthRacik, pickupLengthNon, pickupLengthRacik) {
  // Base configuration
  const BASE_TIME = 10;  // Minimum time (seconds)
  const MAX_TIME = 60;   // Maximum time (seconds)
  
  // Improved calculation using logarithmic scaling
  const calculateDuration = (count) => {
    if (count < 3) return BASE_TIME;
    
    // Logarithmic scaling (slows down growth as numbers increase)
    const scaled = Math.log2(count) * 8;
    
    // Ensure value stays between BASE_TIME and MAX_TIME
    return Math.min(MAX_TIME, Math.max(BASE_TIME, Math.floor(scaled)));
  };

  return {
    processTimeNon: calculateDuration(processLengthNon),
    processTimeRacik: calculateDuration(processLengthRacik),
    pickupTimeNon: calculateDuration(pickupLengthNon),
    pickupTimeRacik: calculateDuration(pickupLengthRacik)
  };
}
useEffect(() => {
  setLastCalled({
    racik: localStorage.getItem('lastCalled_racikan') 
      ? JSON.parse(localStorage.getItem('lastCalled_racikan')) 
      : null,
    nonRacik: localStorage.getItem('lastCalled_nonracikan') 
      ? JSON.parse(localStorage.getItem('lastCalled_nonracikan')) 
      : null
  });
}, []);

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

useEffect(() => {
  const socket = getSocket(); // Ensure this returns a singleton socket instance
socket.on('send_nameToggle', (payload) => {
  if (hideName !== payload.data) {  // Only refresh if state actually changed
    setHideName(payload.data);
    localStorage.setItem('nameToggleState', payload.data.toString());
    window.location.reload();
  }

    return () => socket.off('toggleName', handleToggle);

});
  const handleGetResponses = (payload) => {
    console.log("? GOT RESP", payload);

    // Extract and filter verification data

   const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);

const pickupData = payload.data.pickupData.map(task => {
  const taskDate = new Date(task.waiting_pickup_medicine_stamp);
  taskDate.setHours(0, 0, 0, 0);
  
  return {
    queueNumber: task.queue_number,
    type: task.status_medicine,
    patient_name: task.patient_name,
    isYesterday: taskDate.getTime() === yesterday.getTime(),
    status: task.status === "waiting_pickup_medicine" ? "Menunggu"
      : task.status === "called_pickup_medicine" ? "Dipanggil"
      : task.status === "pending_pickup_medicine" ? "Terlewat"
      : task.status === "recalled_pickup_medicine" ? "Dipanggil"
      : "-",
    waiting_pickup_medicine_stamp: new Date(task.waiting_pickup_medicine_stamp)
  };
});
    console.log("DATE", pickupData.map(task =>new Date(new Date(task.waiting_pickup_medicine_stamp).setHours(0,0,0,0))),new Date(new Date().setHours(0,0,0,0) - 86400000),pickupData.map(task =>new Date(new Date(task.waiting_pickup_medicine_stamp).setHours(0,0,0,0))) == yesterday);


    console.log("DATA", pickupData);

    setQueues({
    
      pickupRacik: pickupData.filter(task => task.type == "Racikan" && task.status != "Terlewat"),
      pickupNonRacik: pickupData.filter(task => task.type == "Non - Racikan" && task.status != "Terlewat"),
        pickupTerlewatRacik: pickupData.filter(task => task.type == "Racikan" && task.status == "Terlewat"),
      pickupTerlewatNonRacik: pickupData.filter(task => task.type == "Non - Racikan"  && task.status == "Terlewat"),
    });

   const newTimes = calculateTime(
  
   
    pickupData.filter(task => task.type == "Non - Racikan" != "Terlewat").length,
    pickupData.filter(task => task.type == "Racikan" != "Terlewat").length,
     pickupData.filter(task => task.type == "Racikan" && task.status == "Terlewat").length,
    pickupData.filter(task => task.type == "Non - Racikan"  && task.status == "Terlewat").length,
  );

  setTimes(newTimes);


  console.log("Time Estimates:", newTimes);
  };

    const handleLatestPickup = (payload) => {
  const data = payload.data;
  console.log("PAYLOAD", data);
  
  setLastCalled(prev => {
    const newState = {
      racik: data.medicine_type === "Racikan" ? data : prev.racik,
      nonRacik: data.medicine_type !== "Racikan" ? data : prev.nonRacik
    };
    
    // Save to localStorage independently
    if (data.medicine_type === "Racikan") {
      localStorage.setItem('lastCalled_racikan', JSON.stringify(data));
    } else {
      localStorage.setItem('lastCalled_nonracikan', JSON.stringify(data));
    }
    
    return newState;
  });
};

  if (socket) {
      socket.emit('get_initial_responses_pickup', { location }, console.log("GET INITIAL DATA"));

    socket.on('get_responses', handleGetResponses, console.log("GET RESPONSES FE"));
    socket.on('send_latest_pickup',(payload)=> handleLatestPickup(payload));
    // Optional: trigger the data on mount
 
  }

  // Cleanup to avoid multiple listeners
  return () => {
    if (socket) {
      socket.off('get_responses', handleGetResponses);
      socket.off('send_latest_pickup',handleLatestPickup)
    }
  };
}, [socket,location]); // Run only once on mount


useEffect(() => {
  const interval = setInterval(() => {
    if (new Date().toDateString() !== currentDate) {
      setCurrentDate(new Date().toDateString());
      window.location.reload();
    }
  }, 300000);
  return () => clearInterval(interval);
}, [currentDate]);


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

  const formatDateTime = (timestamp) => {
  if (!timestamp) return '--:--:--';
  
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    
    if (isNaN(date.getTime())) return '--:--:--';
    
    // Format date (DD/MM/YYYY)
     const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    
    // Format UTC time (HH:MM:SS)
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch {
    return '--:--:--';
  }
};
  // Queue section components
const QueuePickup = ({ title, queuesRacik, queuesNonRacik, bgColor }) => {
  const renderLastCalled = (type) => {
    const item = type === 'racik' ? lastCalled.racik : lastCalled.nonRacik;
    const label = type === 'racik' ? 'Racikan' : 'Non-Racikan';

    return (
      <div className="flex-1 bg-blue-600 p-4 rounded-lg">
        <p className="text-2xl font-bold text-white text-center">Terakhir Dipanggil ({label})</p>
        {item ? (
          <div className="text-white text-center mt-2">
            <div className="text-6xl font-extrabold">{item.queue_number}</div>
            <div className="text-2xl font-extrabold truncate mt-2">         {hideName == 'true' ? hideNameAction(item.patient_name) : item.patient_name}
</div>
            <div className="text-2xl font-extrabold truncate mt-2">
              {formatDateTime(item.waiting_pickup_medicine_stamp)}
            </div>
          </div>
        ) : (
          <div className="text-white text-center mt-2">-</div>
        )}
      </div>
    );
  };

  const renderQueueItem = (queue, isRacikan = true) => (
    <div
      key={`${queue.queueNumber}-${isRacikan ? 'racik' : 'nonracik'}`}
      className="bg-gray-100 text-green-700 text-6xl font-extrabold p-4 shadow border-2 border-black rounded w-full"
      style={{ 
        height: '160px', 
        marginBottom: '8px', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}
    >
      <div className="text-center text-6xl w-full leading-none">
        {queue.queueNumber}
      </div>
      <div className="mt-2 w-full bg-green-400 px-4 py-2 text-black text-center text-3xl truncate whitespace-nowrap overflow-hidden leading-tight">
         {hideName == 'true' ? hideNameAction(queue.patient_name) : queue.patient_name}
      </div>
    </div>
  );

  const renderQueueList = (queues, isRacikan = true) => {
    if (queues.length === 0) {
      return (
        <div className="bg-gray-100 text-black p-4 shadow text-center font-bold text-2xl w-full">
          Belum Ada Antrian
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center justify-center">
        {queues.map((queue) => renderQueueItem(queue, isRacikan))}
      </div>
    );
  };

  const renderMarqueeSection = (queues, duration, isRacikan = true) => (
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
      {renderQueueList(queues, isRacikan)}
    </Marquee>
  );

  return (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md overflow-hidden`} style={{ minHeight: "1200px" }}>
      <p className="text-4xl font-extrabold text-white text-center uppercase">{title}</p>
      
      <div className="flex gap-4 mb-4 mt-2">
        {renderLastCalled('racik')}
        {renderLastCalled('nonracik')}
      </div>

      <div className="flex gap-4 mt-4 flex-wrap">
        {/* Racikan Section */}
        <div className="flex-1 min-w-[300px] bg-gray-100 p-2 rounded-md shadow-md overflow-hidden">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
          {queuesRacik.length > 3 ? 
            renderMarqueeSection(queuesRacik, times.processTimeRacik, true) :
            <div style={{ height: '1030px', overflowY: 'auto' }}>
              {renderQueueList(queuesRacik, true)}
            </div>
          }
        </div>

        {/* Non-Racikan Section */}
        <div className="flex-1 min-w-[300px] bg-gray-100 p-2 rounded-md shadow-md overflow-hidden">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
          {queuesNonRacik.length > 3 ? 
            renderMarqueeSection(queuesNonRacik, times.processTimeNon, false) :
            <div style={{ height: '1030px', overflowY: 'auto' }}>
              {renderQueueList(queuesNonRacik, false)}
            </div>
          }
        </div>
      </div>
    </div>
  );
};
const QueuePickupTerlewat = ({ title, queuesRacik, queuesNonRacik, bgColor }) => {
  const renderQueueItem = (queue, isRacikan = true) => (
    <div
      key={`${queue.queueNumber}-${isRacikan ? 'racik' : 'nonracik'}`}
      className={`uppercase bg-gray-100 p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
      style={{ minHeight: "140px" }}
    >
      <div className="flex flex-col font-extrabold">
        {queue.isYesterday && (
          <div className={`text-2xl ${getStatusColor(queue.status)}`}>KEMARIN</div>
        )}
        <div className={`text-6xl ${getStatusColor(queue.status)}`}>
          {queue.queueNumber}
        </div>
      </div>
      <div className="text-center text-bold mt-2 w-full bg-green-400 px-4 py-2 text-black text-3xl truncate whitespace-nowrap overflow-hidden leading-tight">
         {hideName == 'true' ? hideNameAction(queue.patient_name) : queue.patient_name}
      </div>
    </div>
  );

  const renderQueueList = (queues, isRacikan = true) => {
    if (queues.length === 0) {
      return (
        <div className="bg-gray-100 text-black p-2 shadow text-center font-bold text-2xl h-full flex items-center justify-center">
          Belum Ada Antrian
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {queues.map((queue) => renderQueueItem(queue, isRacikan))}
      </div>
    );
  };

  const renderMarqueeSection = (queues, duration, isRacikan = true) => (
    <Marquee
      fade={true}
      direction="up"
      className="gap-[3rem]"
      innerClassName="gap-[3rem] [--gap:3rem]"
      style={{
        '--duration': `${duration}s`,
        height: '1060px'
      }}
    >
      {renderQueueList(queues, isRacikan)}
    </Marquee>
  );

  const renderQueueSection = (queues, duration, label, isRacikan = true) => (
    <div className="flex-1 min-w-[300px] bg-gray-100 p-2 rounded-md shadow-md" style={{ height: '1120px' }}>
      <p className="text-2xl font-extrabold text-center text-green-700 uppercase">{label}</p>
      <div className="bg-gray-100 rounded-md p-2">
        {queues.length > 4 ? 
          renderMarqueeSection(queues, duration, isRacikan) :
          <div style={{ height: '1060px', overflowY: 'auto' }}>
            {renderQueueList(queues, isRacikan)}
          </div>
        }
      </div>
    </div>
  );

  return (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "1200px" }}>
      <p className="text-4xl font-extrabold text-white text-center uppercase">{title}</p>
      <div className="flex flex-wrap gap-2 mt-2 overflow-x-hidden">
        {renderQueueSection(queuesRacik, times.pickupTimeRacik, "Racikan", true)}
        {renderQueueSection(queuesNonRacik, times.pickupTimeNon, "Non-Racikan", false)}
      </div>
    </div>
  );
};
  return (
   <div className="bg-gray-100 p-4 shadow-lg border border-green-700 w-full "  style={{ minHeight: "300px" }}>
      
        <div className="flex flex-wrap flex-row gap-2">
  <QueuePickup
          title="Obat Telah Selesai" 
          queuesNonRacik={queues.pickupNonRacik} 
          queuesRacik={queues.pickupRacik}        
                    bgColor="bg-green-700" 

        />

        <QueuePickupTerlewat
          title="Panggilan Obat Terlewat" 
          queuesRacik={queues.pickupTerlewatRacik} 
          queuesNonRacik={queues.pickupTerlewatNonRacik} 
          bgColor="bg-red-700" 
        />

        </div>
      

      
      </div>
  );
};

export default NextQueue;