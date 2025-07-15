import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import { getSocket } from "@/app/utils/api/socket";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";
import { queue } from "jquery";

const NextQueue = ({ verificationData, medicineData, pickupData }) => {
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
  const processTimeNon = processLengthNon < 3 ? 10 : (processLengthNon * 10);
  const processTimeRacik =processLengthRacik< 3 ? 10 : (processLengthRacik * 10)
  const pickupTimeNon = pickupLengthNon < 3 ? 10 : (pickupLengthNon * 10);
  const pickupTimeRacik = pickupLengthRacik < 3 ? 10 : (pickupLengthRacik * 10);
  return {  processTimeNon,processTimeRacik, pickupTimeNon,pickupTimeRacik };
}


useEffect(() => {
  const socket = getSocket(); // Ensure this returns a singleton socket instance

  const handleGetResponses = (payload) => {
    console.log("? GOT RESP", payload);

    // Extract and filter verification data
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

    // const calledRacik = pickupData
    //     .filter(task => task.type === "Racikan" && task.status === "Dipanggil")
    //     .sort((a, b) => new Date(b.calledTime) - new Date(a.calledTime))[0];
      
    //   const calledNonRacik = pickupData
    //     .filter(task => task.type === "Non - Racikan" && task.status === "Dipanggil")
    //     .sort((a, b) => new Date(b.calledTime) - new Date(a.calledTime))[0];

    //   setLastCalled({
    //     racik: calledRacik,
    //     nonRacik: calledNonRacik
    //   });
    //     console.log("last",lastCalled);

  console.log("Time Estimates:", newTimes);
  };

     const handleLatestPickup = (payload) => {
        const data = payload.data
        console.log("PAYLOAD",data);
  setLastCalled(prev => ({
  ...prev,
  racik: data.medicine_type === "Racikan" ? data : prev.racik,
  nonRacik: data.medicine_type !== "Racikan" ? data : prev.nonRacik
}));
  console.log("last2",lastCalled);
};

  if (socket) {
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
}, []); // Run only once on mount



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
 const QueuePickup = ({ title, queuesRacik, queuesNonRacik, bgColor }) => (
  <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md overflow-hidden`} style={{ minHeight: "1200px" }}>
    <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
     <div className="flex gap-4 mb-4 mt-2">
        {/* Last Called Racikan */}
        <div className="flex-1 bg-blue-600 p-4 rounded-lg ">
          <p className="text-2xl font-bold text-white text-center">Terakhir Dipanggil (Racikan)</p>
          {lastCalled.racik ? (
            <div className="text-white text-center mt-2">
              <div className="text-6xl font-extrabold">{lastCalled.racik.queue_number}</div>
              <div className="text-2xl font-extrabold truncate mt-2">{lastCalled.racik.patient_name}</div>
            </div>
          ) : (
            <div className="text-white text-center mt-2">-</div>
          )}
        </div>
        
        {/* Last Called Non-Racikan */}
        <div className="flex-1 bg-blue-600 p-4 rounded-lg">
          <p className="text-2xl font-bold text-white text-center">Terakhir Dipanggil (Non-Racikan)</p>
          {lastCalled.nonRacik ? (
            <div className="text-white text-center mt-2">
              <div className="text-6xl font-extrabold">{lastCalled.nonRacik.queue_number}</div>
              <div className="text-2xl font-extrabold truncate mt-2">{lastCalled.nonRacik.patient_name}</div>
            </div>
          ) : (
            <div className="text-white text-center mt-2">-</div>
          )}
        </div>
      </div>
    <div className="flex gap-4 mt-4 flex-wrap">
       
      {/* Racikan Section - Now matches Non-Racikan styling */}
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md overflow-hidden">
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
        <Marquee
          direction="up"
          pauseOnHover
          style={{
            width: '100%',
            marginTop: 20,
            marginBottom: 10,
            '--duration': `${times.processTimeRacik}s`,     height: `1030px`
          }}
          
        >
          <div className="w-full flex flex-col items-center justify-center">
            {queuesRacik.length > 0 ? (
              queuesRacik.map((queue, index) => (
                <div
                  key={index}
                  className="bg-white text-green-700 text-6xl font-extrabold p-4 shadow border-2 border-black  rounded w-full"
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
                    {queue.patient_name}
                  </div>
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
      <div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md overflow-hidden">
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
        <Marquee
          direction="up"
          pauseOnHover
          style={{
            width: '100%',
            height: '50%',
            marginTop: 20,
            marginBottom: 10,
            '--duration': `${times.processTimeNon}s`,     height: `1030px`
          }}

        >
          <div className="w-full flex flex-col items-center justify-center">
            {queuesNonRacik.length > 0 ? (
              queuesNonRacik.map((queue, index) => (
                <div
                  key={index}
                  className="bg-white text-green-700 text-6xl font-extrabold p-4 shadow border-2 border-black rounded w-full"
                  style={{ 
                    height: '160px', 
                    marginBottom: '8px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                  }}
                  
                >
                  <div className="text-center text-6xl w-full leading-none">
                    {queue.queueNumber}
                  </div>
                  <div className="mt-2 w-full bg-green-400 px-4 py-2 text-3xl text-black text-center  truncate whitespace-nowrap overflow-hidden leading-tight">
                    {queue.patient_name}
                  </div>
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

const QueuePickupTerlewat = ({ title, queuesRacik, queuesNonRacik, bgColor }) => (
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
                      <div className={`text-6xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
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
                      <div className={`text-6xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
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