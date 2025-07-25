import { useEffect, useRef, useState } from "react";
import VerificationAPI from "@/app/utils/api/Verification"; // ✅ API untuk Verifikasi
import PickupAPI from "@/app/utils/api/Pickup"; // ✅ API untuk Pengambilan Obat
import {getSocket} from "@/app/utils/api/socket";
const MissQueue = ( {verificationData, pickupData}) => {
  const [verifQueues, setVerifQueues] = useState([]);
  const [obatQueues, setObatQueues] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().getDate());
  // const bottomRef= useRef<HTMLDivElement>(null);
  const scrollSpeed = 1;
  const verifRef = useRef(null);
  const obatRef = useRef(null);
const socket = getSocket();

  // ✅ Ambil Data Pending dari Backend
  useEffect(() => {
    const fetchMissedQueues = async () => {
      try {
        socket.on('get_responses_bpjs',(payload)=>{
          const verifData = payload.data.verificationData.filter(
            (queue) => queue.status === "pending_verification" && queue.lokasi == "Lantai 1 BPJS"
          );

          const pickupData = payload.data.pickupData.filter(
            (queue) => queue.status === "pending_pickup_medicine" && queue.lokasi == "Lantai 1 BPJS"
          );


          setVerifQueues(verifData);
          setObatQueues(pickupData);


        });
       
      } catch (error) {
        console.error("❌ Error fetching missed queues:", error);
      }
    };

    fetchMissedQueues();
  
  }, []);

  
useEffect(() => {
  const interval = setInterval(() => {
    if (new Date().toDateString() !== currentDate) {
      setCurrentDate(new Date().toDateString());
      window.location.reload();
    }
  }, 3600000);
  return () => clearInterval(interval);
}, [currentDate]);


  // ✅ Efek Scroll Otomatis
  const scrollAndReset = (ref) => {
    if (!ref.current) return;
    const scroll = () => {
      const maxScroll = ref.current.scrollHeight - ref.current.clientHeight;
      if (ref.current.scrollTop < maxScroll) {
        ref.current.scrollBy({ top: scrollSpeed, behavior: "smooth" });
        requestAnimationFrame(scroll);
      } else {
        setTimeout(() => {
          ref.current.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => requestAnimationFrame(scroll), 3000);
        }, 2000);
      }
    };
    requestAnimationFrame(scroll);
  };

  useEffect(() => {
   scrollAndReset(verifRef);
    scrollAndReset(obatRef);
  }, [verifQueues, obatQueues]);
  
  // ✅ Format waktu untuk tampilan
  const formatTime = (timestamp) => {
    if (!timestamp) return "Waktu Tidak Tersedia";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-white p-6 shadow-lg border border-red-700 w-full h-full flex flex-col">
      {/* ✅ Antrean Verifikasi */}
      <div className="mb-6">
        <h2 className="text-4xl font-extrabold text-red-700 text-center mb-4">
          Antrean Terlewati (Verifikasi)
        </h2>
        <div
          className="p-4 bg-red-700 text-white rounded-lg shadow overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "200px" }}
          ref={verifRef}
        >
          {verifQueues.length > 0 ? (
            verifQueues.map((queue, index) => (
              console.log("QUEUE",queue),

              <div
                key={index}
                className="bg-white text-red-700 rounded-md p-4 mb-2 shadow flex items-center justify-between text-2xl font-bold"
              >
                <span className="w-24">{queue.queue_number}</span>
                <span>{queue.loket || "Loket Tidak Diketahui"}</span>
                <span>Terakhir Dipanggil: {formatTime(queue.called_verification_stamp)}</span>
              </div>
            ))
          ) : (
            <div className="bg-white text-red-700 rounded-md p-4 shadow text-center text-2xl font-bold">
              Tidak Ada Antrian Terlewati
            </div>
          )}
        </div>
      </div>

      {/* ✅ Antrean Pengambilan Obat */}
      <div>
        <h2 className="text-4xl font-extrabold text-red-700 text-center mb-4">
          Antrean Terlewati (Pengambilan Obat)
        </h2>
        <div
          className="p-4 bg-red-700 text-white rounded-lg shadow overflow-y-auto scrollbar-hide"
          style={{ maxHeight: "200px" }}
          ref={obatRef}
        >
          {obatQueues.length > 0 ? (
            obatQueues.map((queue, index) => (
              <div
                key={index}
                className="bg-white text-red-700 rounded-md p-4 mb-2 shadow flex items-center justify-between text-2xl font-bold"
              >
                <span className="w-24">{queue.queue_number}</span>
                <span>{queue.loket || "Loket Tidak Diketahui"}</span>
                <span>Terakhir Dipanggil: {formatTime(queue.called_pickup_medicine_stamp)}</span>
              </div>
            ))
          ) : (
            <div className="bg-white text-red-700 rounded-md p-4 shadow text-center text-2xl font-bold">
              Tidak Ada Antrian Terlewati
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissQueue;
