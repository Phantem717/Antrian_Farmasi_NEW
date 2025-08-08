import React, { useState,useEffect } from "react";
import { Box, Button } from "@mui/material";
import PickupAPI from "@/app/utils/api/Pickup";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import LoketAPI from "@/app/utils/api/Loket";
import Swal from "sweetalert2";
import {getSocket} from "@/app/utils/api/socket";
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";
import { queue } from "jquery";
const PilihAksi = ({location, selectedQueue,selectedQueueIds = [], setSelectedQueueIds, onStatusUpdate, setSelectedQueue2,selectedQueue2 }) => {
  console.log("QUEUS",selectedQueue2);
const socket = getSocket();
  const [isCompleteServiceEnabled, setIsCompleteServiceEnabled] = useState(false);

  // ✅ Status yang sesuai untuk PickupAPI & PharmacyAPI
  const validStatus = {
    call: "called_pickup_medicine",
    pending: "pending_pickup_medicine",
    complete: "completed_pickup_medicine",
    recall: "recalled_pickup_medicine",
  };

 useEffect(() => {
    const shouldEnable = selectedQueue2.some(queue => 
      queue.status === "pending_pickup_medicine" || 
      queue.status === "called_pickup_medicine" ||
      queue.status === "recalled_pickup_medicine"
    );
    setIsCompleteServiceEnabled(shouldEnable);
  }, [selectedQueue2]); // Re-run whenever selectedQueue2 changes

  // ✅ Fungsi untuk Update Status ke API Pickup & Pharmacy
  const handleStatusUpdate = async (statusType) => {
    if (!selectedQueue) {
      Swal.fire({
        icon: "warning",
        title: "Pilih antrian terlebih dahulu!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const status = validStatus[statusType];

      

      // await Promise.all([
      //   PickupAPI.updatePickupTask(selectedQueue.NOP, requestBody),
      //   PharmacyAPI.updatePharmacyTask(selectedQueue.NOP, requestBody),
      // ]);
      if(statusType == "call" || statusType === "recall"){
          const respLoket = await LoketAPI.getAllLokets();
          const respData = respLoket.data;
            const loket = respData.filter(loket => loket.status === "active" && (loket.loket_name === "Loket 1" || loket.loket_name == "Loket 4"))[0].loket_name;
          
            const updatedQueues = selectedQueue2.map(queue => ({
      ...queue,
      loket: loket
    }));
           
       
    socket.emit('call_queues_pickup', {
      data: updatedQueues,
      lokasi: "Lantai 1 BPJS"
    });

        
      }
      await Promise.all(
        selectedQueue2.map(async (queue) => {
          const requestBody = {
            status: status,
            medicine_type: queue.status_medicine,
          };
    
          console.log("📡 Mengirim data ke API Pickup & Pharmacy:", {
            NOP: selectedQueue.NOP,
            body: requestBody,
          });
          
            if (queue.status != "waiting_pickup_medicine" ) {
        setIsCompleteServiceEnabled(true);
      }

          await Promise.all([
            PickupAPI.updatePickupTask(queue.NOP, requestBody),
            PharmacyAPI.updatePharmacyTask(queue.NOP, requestBody),
          ]);
          if(statusType == "call"){
            const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(queue.NOP);
          
            console.log("DOCRESP",doctorResponse);
          

            const payload = {
              phone_number: doctorResponse.data.phone_number,
              patient_name: doctorResponse.data.patient_name,
              medicine_type : doctorResponse.data.status_medicine,
              sep: doctorResponse.data.sep_no,
              rm: doctorResponse.data.medical_record_no,
              docter: doctorResponse.data.doctor_name,
              nik: doctorResponse.data.nik,
              queue_number: doctorResponse.data.queue_number,
              NOP : doctorResponse.data.NOP,
              waiting_pickup_medicine_stamp: queue.waiting_pickup_medicine_stamp,
              switch_WA: localStorage.getItem('waToggleState') || "true"

          }


          console.log("PAYLOAD PICKUP",payload)
        if (queue === selectedQueue2[0]) { // Only for first item
          console.log("CALLED");
            socket.emit('update_latest_pickup',
 {
              message: "Update Pickup",
              data: payload
            });
          }

      
            const sendResponse = await WA_API.sendWAPickup(payload);
                              await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

            // console.log("WA SENT",sendResponse);   
          }
        })

       
      );
        
      Swal.fire({
        icon: "success",
        title: `Status berhasil diperbarui menjadi ${status.replace("_", " ")}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // ✅ Jika "PANGGIL NOMOR" ditekan, aktifkan "SELESAIKAN LAYANAN"
    
       socket.emit('update_pickup', {location});
        socket.emit('update_display', {location},console.log("EMIT UPDATE"));

      setSelectedQueue2([]); // ✅ Reset pilihan setelah pemanggilan
      
      setSelectedQueueIds([]);
     
      onStatusUpdate();
      

    } catch (error) {
      console.error("❌ Error detail:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui status!",
        text: error.message || "Terjadi kesalahan saat menghubungi server.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
        maxWidth: "500px",
        margin: "auto",
        marginTop:"0"
      }}
    >
      {/* ✅ PANGGIL NOMOR */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: selectedQueue ? "#4CAF50" : "#b0bec5",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "15px",
          height: "60px",
          fontSize: "1rem",
        }}
        onClick={() => handleStatusUpdate("call")}
        disabled={!selectedQueue}
      >
        PANGGIL NOMOR
      </Button>

      {/* ✅ PENDING */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: selectedQueue ? "#FF9800" : "#b0bec5",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "10px",
          height: "60px",
          fontSize: "1rem",
        }}
        onClick={() => handleStatusUpdate("pending")}
        disabled={!selectedQueue}
      >
        PENDING
      </Button>

      {/* ✅ SELESAIKAN LAYANAN (Sekarang bisa langsung aktif setelah "PANGGIL NOMOR") */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: isCompleteServiceEnabled ? "#D32F2F" : "#b0bec5",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "12px",
          height: "55px",
          fontSize: "0.95rem",
        }}
        onClick={() => handleStatusUpdate("complete")}
        disabled={!isCompleteServiceEnabled}
      >
        SELESAIKAN LAYANAN
      </Button>

      {/* ✅ PANGGIL ULANG */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: selectedQueue ? "#FFD700" : "#b0bec5",
          color: "#000000",
          fontWeight: "bold",
          padding: "12px",
          height: "60px",
          fontSize: "1rem",
          width: "100%",
        }}
        onClick={() => handleStatusUpdate("recall")}
        disabled={!selectedQueue}
      >
        PANGGIL ULANG
      </Button>
    </Box>
  );
};

export default PilihAksi;
