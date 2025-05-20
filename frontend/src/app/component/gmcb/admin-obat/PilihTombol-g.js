import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import PickupAPI from "@/app/utils/api/Pickup";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import Swal from "sweetalert2";
import {getSocket} from "@/app/utils/api/socket";
const PilihAksi = ({ selectedQueue,selectedQueueIds = [], setSelectedQueueIds, onStatusUpdate, setSelectedQueue2,selectedQueue2 }) => {
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
      //   PickupAPI.updatePickupTask(selectedQueue.booking_id, requestBody),
      //   PharmacyAPI.updatePharmacyTask(selectedQueue.booking_id, requestBody),
      // ]);
      if(statusType == "call" || statusType === "recall"){
        socket.emit('call_queues_pickup', {
          data:selectedQueue2, lokasi: "Lantai 1 GMCB"
        });
      }
      await Promise.all(
        selectedQueue2.map(async (queue) => {
          const requestBody = {
            status: status,
            medicine_type: queue.status_medicine,
          };
    
          console.log("📡 Mengirim data ke API Pickup & Pharmacy:", {
            booking_id: selectedQueue.booking_id,
            body: requestBody,
          });
      
          await Promise.all([
            PickupAPI.updatePickupTask(queue.booking_id, requestBody),
            PharmacyAPI.updatePharmacyTask(queue.booking_id, requestBody),
          ]);
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
      if (statusType === "call" ) {
        setIsCompleteServiceEnabled(true);
      }
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
