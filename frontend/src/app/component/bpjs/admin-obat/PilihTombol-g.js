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
const PilihAksiG = ({location, selectedQueue,selectedQueueIds = [], setSelectedQueueIds, onStatusUpdate, setSelectedQueue2,selectedQueue2, selectedLoket }) => {
  console.log("QUEUS",selectedQueue2, selectedLoket);
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

  
const reorderQueueAfterCall = async (calledQueues, allQueues) => {
  try {
    console.log("TEST",calledQueues,allQueues);
    // Separate queues by medicine type
    const racikanQueues = allQueues.filter(q => q.status_medicine === "Racikan");
    const nonRacikanQueues = allQueues.filter(q => q.status_medicine === "Non - Racikan");
    
    // Process each called queue
    for (const calledQueue of calledQueues) {
      const isRacikan = calledQueue.status_medicine === "Racikan";
      const relevantQueues = isRacikan ? racikanQueues : nonRacikanQueues;
      
      // Find current position
      const currentIndex = relevantQueues.findIndex(q => q.NOP === calledQueue.NOP);
      
      if (currentIndex === -1) continue;
      
      // Calculate new position (3 positions down)
      const newIndex = Math.min(currentIndex + 3, relevantQueues.length - 1);
      
      // Get the queue that will be at the new position
      const targetQueue = relevantQueues[newIndex];
      
      if (!targetQueue) continue;
      
      // Get timestamp slightly after the target queue
      const targetTimestamp = new Date(targetQueue.waiting_pickup_medicine_stamp);
      const newTimestamp = new Date(targetTimestamp.getTime() + 900000); // 1 second after
      
      // Update the called queue's timestamp
      const update = await PickupAPI.updatePickupTask(calledQueue.NOP, {
        called_pickup_medicine_stamp: newTimestamp,
      });
      console.log("UPDATE",update);
      console.log(`✅ Moved ${calledQueue.queue_number} down 3 positions`);
    }
  } catch (error) {
    console.error("Error reordering queue:", error);
  }
};

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

    // ✅ First, update status for all selected queues
    await Promise.all(
      selectedQueue2.map(async (queue) => {
        const requestBody = {
          status: status,
          medicine_type: queue.status_medicine,
        };

        await Promise.all([
          PickupAPI.updatePickupTask(queue.NOP, requestBody),
          PharmacyAPI.updatePharmacyTask(queue.NOP, requestBody),
        ]);
      })
    );

    // ✅ If calling queues, handle reordering and notifications
    if (statusType == "call" || statusType === "recall") {
      const respLoket = await LoketAPI.getAllLokets();
      const updatedQueues = selectedQueue2.map(queue => ({
        ...queue,
        loket: selectedLoket
      }));
      
      // Emit socket for display
      socket.emit('call_queues_pickup', {
        data: updatedQueues,
        lokasi: "Lantai 1 BPJS"
      });

      // ✅ Reorder queue - push down 3 positions
      // Get all current queues from the list
      const allCurrentQueues = await PickupAPI.getPickupToday(location);
      await reorderQueueAfterCall(selectedQueue2, allCurrentQueues.data);

      // Send WhatsApp notifications
      for (const queue of selectedQueue2) {
        const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(queue.NOP);
        
        const payload = {
          phone_number: doctorResponse.data.phone_number,
          patient_name: doctorResponse.data.patient_name,
          medicine_type: doctorResponse.data.status_medicine,
          sep: doctorResponse.data.sep_no,
          rm: doctorResponse.data.medical_record_no,
          docter: doctorResponse.data.doctor_name,
          nik: doctorResponse.data.nik,
          queue_number: doctorResponse.data.queue_number,
          NOP: doctorResponse.data.NOP,
          waiting_pickup_medicine_stamp: queue.waiting_pickup_medicine_stamp,
          switch_WA: localStorage.getItem('waToggleState') || "true",
          loket: selectedLoket,
          location: location
        };

        if (queue === selectedQueue2[0]) {
          socket.emit('update_latest_pickup', {
            message: "Update Pickup",
            data: payload
          });
        }

        // await WA_API.sendWAPickup(payload);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    Swal.fire({
      icon: "success",
      title: `Status berhasil diperbarui menjadi ${status.replace("_", " ")}`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

    setIsCompleteServiceEnabled(statusType === "call" || statusType === "recall");
    
    socket.emit('update_pickup', { location });
    socket.emit('update_display', { location });

    setSelectedQueue2([]);
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

  // Add this function in PilihAksiG component or in a utils file

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

export default PilihAksiG;
