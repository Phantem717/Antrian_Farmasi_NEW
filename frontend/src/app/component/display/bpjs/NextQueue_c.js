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

  // Refs for scrollable containers
  const verifRef = useRef(null);
  const medicineRefRacik = useRef(null);
  const medicineRefNonRacik = useRef(null);
  const pickupRefRacik = useRef(null);
  const pickupRefNonRacik = useRef(null);

  // State to track scroll positions
  const [scrollPositions, setScrollPositions] = useState({
    verif: 0,
    medicineRacik: 0,
    medicineNonRacik: 0,
    pickupRacik: 0,
    pickupNonRacik: 0
  });

  // State to track active scrolling
  const [isScrolling, setIsScrolling] = useState({
    verif: false,
    medicineRacik: false,
    medicineNonRacik: false,
    pickupRacik: false,
    pickupNonRacik: false
  });

  // Enhanced auto-scroll function
  const autoScroll = (ref, key) => {
    if (!ref.current || isScrolling[key]) return;

    setIsScrolling(prev => ({ ...prev, [key]: true }));
    const scrollSpeed = 25;
    const delayBeforeReset = 500000;

    const scroll = () => {
      if (!ref.current) return;
      const maxScroll = ref.current.scrollHeight - ref.current.clientHeight;
      const currentScroll = ref.current.scrollTop;

      if (currentScroll < maxScroll - 10) {
        ref.current.scrollBy({ top: scrollSpeed, behavior: "smooth" });
        requestAnimationFrame(scroll);
      } else {
        setTimeout(() => {
          if (ref.current) {
            ref.current.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
              setIsScrolling(prev => ({ ...prev, [key]: false }));
              if (ref.current.scrollHeight === maxScroll + scrollSpeed) {
                autoScroll(ref, key);
              }
            }, 10000);
          }
        }, delayBeforeReset);
      }
    };

    requestAnimationFrame(scroll);
  };

  // Save scroll positions before updates
  const saveScrollPositions = () => {
    setScrollPositions({
      verif: verifRef.current?.scrollTop || 0,
      medicineRacik: medicineRefRacik.current?.scrollTop || 0,
      medicineNonRacik: medicineRefNonRacik.current?.scrollTop || 0,
      pickupRacik: pickupRefRacik.current?.scrollTop || 0,
      pickupNonRacik: pickupRefNonRacik.current?.scrollTop || 0
    });
  };

  // Restore scroll positions after updates
  const restoreScrollPositions = () => {
    setTimeout(() => {
      if (verifRef.current) verifRef.current.scrollTop = scrollPositions.verif;
      if (medicineRefRacik.current) medicineRefRacik.current.scrollTop = scrollPositions.medicineRacik;
      if (medicineRefNonRacik.current) medicineRefNonRacik.current.scrollTop = scrollPositions.medicineNonRacik;
      if (pickupRefRacik.current) pickupRefRacik.current.scrollTop = scrollPositions.pickupRacik;
      if (pickupRefNonRacik.current) pickupRefNonRacik.current.scrollTop = scrollPositions.pickupNonRacik;
    }, 0);
  };

  // Initialize scrolling when queues update
  useEffect(() => {
    saveScrollPositions();
    
    if (queues.verificationQueue.length > 0) autoScroll(verifRef, 'verif');
    if (queues.medicineRacik.length > 0) autoScroll(medicineRefRacik, 'medicineRacik');
    if (queues.medicineNonRacik.length > 0) autoScroll(medicineRefNonRacik, 'medicineNonRacik');
    if (queues.pickupRacik.length > 0) autoScroll(pickupRefRacik, 'pickupRacik');
    if (queues.pickupNonRacik.length > 0) autoScroll(pickupRefNonRacik, 'pickupNonRacik');

    restoreScrollPositions();
  }, [queues]);

  // Fetch queue data
  useEffect(() => {
    const socket = getSocket();
    const fetchQueues = async () => {
      try {
        socket.on('get_responses', (payload) => {
          saveScrollPositions();
          const dateString = new Date().toISOString().split('T')[0];

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


          // Process medicine data
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
      } catch (error) {
        console.error("Error fetching queue data:", error);
      }
    };

    fetchQueues();
    return () => socket.off('get_responses');
  }, []);

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
  const QueueSection = ({ title, queuesRacik, queuesNonRacik, innerRefRacik, innerRefNonRacik, bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "300px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
      <div className="flex gap-2 mt-2">
        {/* Racikan */}
<div className="flex-1 bg-white p-2 rounded-md shadow-md">
  <p className="text-2xl font-extrabold text-center text-green-500 uppercase">Racikan</p>

  <Marquee
    direction="up"
    pauseOnHover
    gradient={false}
    style={{
      width: '100%',         // Ambil seluruh lebar parent
      height: 500,           // Tinggi tampilan marquee
      overflow: 'hidden',
      marginTop: 20,
      marginBottom: 10,
    }}
  >
    <div className="w-full flex flex-col items-center">
      {queuesRacik.length > 0 ? (
        queuesRacik.map((queue, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-white text-green-700 text-6xl font-extrabold p-4 shadow text-center border border-gray-300 rounded w-[95%]"
            style={{
              height: '120px',
              marginBottom: '8px',
            }}
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

        
        {/* Non-Racikan */}
        <div className="flex-1 bg-white p-2 rounded-md shadow-md">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
          <div className="overflow-y-auto scrollbar-hide bg-white rounded-md p-2" ref={innerRefNonRacik} style={{ minHeight: "300px" }}>
            {queuesNonRacik.length > 0 ? (
              queuesNonRacik.map((queue, index) => (
                <div key={index} className="flex items-center justify-center bg-white text-green-700 text-5xl p-2 shadow text-center font-bold border border-gray-300 rounded block mb-1" style={{ height: "80px" }}>
                  {queue.queueNumber}
                </div>
              ))
            ) : (
              <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">Belum Ada Antrian</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const QueueSectionVerification = ({ title, queues, innerRef, bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "300px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
      <div className="flex gap-2 mt-2">
        <div className="flex-1 bg-white p-2 rounded-md shadow-md">
          <div className="overflow-y-auto scrollbar-hide bg-white rounded-md p-2" ref={innerRef} style={{ height: "825px" }}>
            {queues.length > 0 ? (
              queues.map((queue, index) => (
                <div key={index} className={`uppercase bg-white p-2 shadow text-center font-extrabold rounded mb-1 flex items-center ${getStatusColourBorder(queue.status)}`} style={{ height: "120px" }}>
                  <div className={`flex-1 text-4xl text-left ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
                  <div className={`flex-1 text-3xl text-center ${getStatusColor(queue.status)}`}>{queue.type}</div>
                  <div className={`flex-1 text-3xl text-right ${getStatusColor(queue.status)}`}>{queue.status}</div>
                </div>
              ))
            ) : (
              <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">Belum Ada Antrian</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const QueueSectionPickup = ({ title, queuesRacik, queuesNonRacik, innerRefRacik, innerRefNonRacik, bgColor }) => (
    <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`} style={{ minHeight: "300px" }}>
      <p className="text-2xl font-bold text-white text-center uppercase">{title}</p>
<div className="flex flex-wrap gap-2 mt-2 overflow-x-hidden">
        {/* Racikan */}
<div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Racikan</p>
<div
  className="overflow-y-auto max-h-[800px] scrollbar-hide bg-white rounded-md p-2 flex flex-col gap-2"
  ref={innerRefRacik}
>            {queuesRacik.length > 0 ? (
              queuesRacik.map((queue, index) => (
              <div
  key={index}
  className={`uppercase bg-white p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
  style={{ minHeight: "120px" }}
>
  <div className={`text-4xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
  <div className={`text-3xl ${getStatusColor(queue.status)}`}>{queue.status}</div>
</div>
              ))
            ) : (
              <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">Belum Ada Antrian</div>
            )}
          </div>
        </div>
        
        {/* Non-Racikan */}
<div className="flex-1 min-w-[300px] bg-white p-2 rounded-md shadow-md">
          <p className="text-2xl font-extrabold text-center text-green-700 uppercase">Non-Racikan</p>
<div
  className="overflow-y-auto max-h-[800px] scrollbar-hide bg-white rounded-md p-2 flex flex-col gap-2"
  ref={innerRefNonRacik}
>            {queuesNonRacik.length > 0 ? (
              queuesNonRacik.map((queue, index) => (
               <div
  key={index}
  className={`uppercase bg-white p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
  style={{ minHeight: "120px" }}
>
  <div className={`text-4xl ${getStatusColor(queue.status)}`}>{queue.queueNumber}</div>
  <div className={`text-3xl ${getStatusColor(queue.status)}`}>{queue.status}</div>
</div>
              ))
            ) : (
              <div className="bg-white text-black p-2 shadow text-center font-bold text-2xl">Belum Ada Antrian</div>
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
          innerRef={verifRef} 
          bgColor="bg-green-700"
        />

        <QueueSection 
          title="Proses Pembuatan Obat" 
          queuesRacik={queues.medicineRacik} 
          queuesNonRacik={queues.medicineNonRacik} 
          innerRefRacik={medicineRefRacik} 
          innerRefNonRacik={medicineRefNonRacik} 
          bgColor="bg-yellow-600" 
        />

        <QueueSectionPickup 
          title="Obat Telah Selesai" 
          queuesRacik={queues.pickupRacik} 
          queuesNonRacik={queues.pickupNonRacik} 
          innerRefRacik={pickupRefRacik} 
          innerRefNonRacik={pickupRefNonRacik} 
          bgColor="bg-green-700" 
        />
      </div>
    </div>
  );
};

export default NextQueue;