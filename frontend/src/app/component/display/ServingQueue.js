import { useEffect, useState } from "react";
import LoketAPI from "../../utils/api/Loket";
import {getSocket} from "@/app/utils/api/socket";
const ServingQueue = ({loketData}) => {
  const socket = getSocket();

  const [servingData, setServingData] = useState([]);
const [loket,setLoket] = useState([]);
  // ✅ Fetch Data Loket dari API dan Update UI
 
  useEffect(() => {
    const fetchLokets = async () => {
      try {
        const response = await LoketAPI.getAllLokets();
        console.log("📡 Data Loket dari API:", response); // Debugging
        socket.on('get_responses',(data)=> {
          console.log("SOCKET EMITTED RESPONSE",data.data.loketData);
          const formattedData = data.data.loketData.map((loket) => ({
            id: loket.loket_id,
            label: loket.loket_name,
            status: loket.status.toLowerCase(), // Pastikan status selalu huruf kecil
            counter: loket.status.toLowerCase() === "active" || loket.status.toLowerCase() === "open" ? "BUKA" : "TUTUP",
          }));        
          setServingData(formattedData);

        })
      
    
      
        return () => {
          socket.off('get_responses', handleQueueUpdate);
    
          socket.disconnect();
        };
      
      } catch (error) {
        console.error("❌ Error fetching loket data:", error);
      }
    };

    fetchLokets(); // Fetch pertama kali saat komponen dimuat
    // const interval = setInterval(fetchLokets, 5000); // Update otomatis setiap 5 detik
    // return () => clearInterval(interval); // Hentikan polling saat komponen di-unmount
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-green-700 w-full">
      <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        Loket Antrian yang Sedang Melayani
      </h2>

      <div className="flex flex-col gap-6 items-center">
        {servingData.length > 0 ? (
          servingData.map(({ id, label, counter, status }) => (
            <div
              key={id}
              className={`p-6 h-20 w-3/4 rounded-lg flex justify-between items-center text-2xl font-bold ${
                status === "active" || status === "open" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}
            >
              <p className="text-2xl">{label}</p>
              <span
                className={`p-4 h-16 w-32 rounded-lg shadow text-2xl flex items-center justify-center ${
                  status === "active" || status === "open" ? "bg-white text-green-700" : "bg-white text-gray-700"
                }`}
              >
                {counter}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xl text-gray-500">Memuat data loket...</p>
        )}
      </div>
    </div>
  );
};

export default ServingQueue;
