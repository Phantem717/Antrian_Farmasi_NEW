"use client";

import React,{useEffect,useState,useRef} from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { updateButtonStatus } from "@/app/utils/api/Button";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import MedicineAPI from "@/app/utils/api/Medicine";
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import Swal from "sweetalert2";
import {getSocket} from "@/app/utils/api/socket";
import WA_API from "@/app/utils/api/WA";
import BarcodeScanner from "./barcodescanner_v-v";
import CreateAntrianAPI from "@/app/utils/api/createAntrian";
import PrintAntrian from "@/app/utils/api/printAntrian";
// import VerificationAPI from "../../../utils/api/Verification";

const PilihAksi = ({location, selectedQueueIds = [], setSelectedQueueIds, selectedQueue2 = [] , setSelectedQueue2}) => {  
  const [isDeleted, setIsDeleted] = useState(false); // ✅ Untuk menghapus input scanner
   const [scanResult, setScanResult] = useState(""); // ✅ Simpan hasil scan
 
  // ✅ Fungsi untuk memanggil banyak nomor antrian sekaligus
 console.log("QUEUE4",selectedQueue2);
  const socket = getSocket();
  useEffect(()=>{
 

    socket.emit('test_pilih', {
      message: "Update Called",
    });

    console.log("queueset2",selectedQueue2);
  },[]);
 
  const handleBulkCall = async () => {
    if (selectedQueueIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Pilih minimal satu nomor antrian!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      console.log("📡 Memanggil nomor:", selectedQueueIds, selectedQueue2);
      socket.emit('call_queues_verif',{data: selectedQueue2, lokasi: "Lantai 1 BPJS"});
      await Promise.all(
        selectedQueue2.map(async (queue) => {
          await updateButtonStatus(queue.NOP, "called_verification");
            // console.log("CHANGED STATUS");
            socket.emit('queue_called',{
              message: "Update Called",
              data: queue,
            });


            console.log("SCOKET EMITTED",queue);
            
           
            

        })
      );

      Swal.fire({
        icon: "success",
        title: `Berhasil memanggil ${selectedQueueIds.length} nomor!`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setSelectedQueueIds([]);
      setSelectedQueue2([]); // ✅ Reset pilihan setelah pemanggilan

    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memanggil nomor!",
        text: error.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  // ✅ Fungsi untuk update status antrian tunggal
  const handleBulkStatusUpdate = async (statusType) => {
    console.log("QUEUE",selectedQueue2);
    socket.emit('button_test',{
      message: "TEST BUTTON"
    });

    if (selectedQueueIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Pilih minimal satu nomor antrian!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
  
    try {
      console.log("📡 Memperbarui status untuk:", selectedQueueIds, "dengan status:", statusType);
  
      await Promise.all(
        selectedQueue2.map(async (queue) => {
          const NOP = queue.NOP;
      
              console.log("STATUS TYPE",statusType);
              if(statusType == "recalled_verification"){
                console.log("CHANGED STATUS");
                socket.emit('call_queues_verif',{data: selectedQueue2, lokasi: "Lantai 1 BPJS"});

             
                console.log("SCOKET EMITTED",queue);
              }
          // Update the status for this queue item
          await updateButtonStatus(NOP, statusType);
          // const io = 
        })
      );
      

      Swal.fire({
        icon: "success",
        title: `Berhasil memperbarui ${selectedQueueIds.length} antrian ke status ${statusType.replace("_", " ")}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      setSelectedQueue2([]); // ✅ Reset pilihan setelah pemanggilan

      setSelectedQueueIds([]); // ✅ Reset setelah update
                socket.emit('update_verif', {location});

    } catch (error) {
      console.error("❌ Error saat memperbarui status:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui status!",
        text: error.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }



  };

  const handleBulkPharmacyUpdate = async (medicineType) => {
  if (selectedQueue2.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Pilih minimal satu nomor antrian!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    console.log("📡 Bulk update:", selectedQueue2, "->", medicineType);

    // ✅ Track success/failure
    const results = {
      success: [],
      failed: []
    };

    // ✅ Process each queue item sequentially to avoid race conditions
    for (const queue of selectedQueue2) {
      try {
        console.log(`Processing queue: ${queue.NOP} (${queue.queue_number})`);

        // === 1. Determine if we need a new queue number
        const needsNewQueue = 
          (queue.status_medicine === "Racikan" && medicineType === "Non - Racikan") ||
          (queue.status_medicine === "Non - Racikan" && medicineType === "Racikan") ||
          queue.queue_number?.startsWith("TR-") || queue.queue_number.startsWith("C-") || queue.queue_number.startsWith("D-");

        let newQueueNumber = queue.queue_number;

        if (needsNewQueue) {
          // Map location correctly
          const locationMap = {
            "bpjs": "farmasi-bpjs",
            "gmcb": "farmasi-gmcb-lt1",
            "lt3": "farmasi-gmcb-lt3"
          };
          
          const newLocation = locationMap[location] || "farmasi-bpjs";
          console.log(`Creating new queue for location: ${newLocation}`);
          console.log("TEST",newLocation,medicineType);
          // Create new queue number
          const antrianResp = await CreateAntrianAPI.createAntrian(medicineType, newLocation);
          const antrianData = antrianResp.data;
          console.log("Antrian RESP",antrianData);
          if (!antrianData?.data?.queue_number) {
            throw new Error("Failed to create new queue number");
          }

          newQueueNumber = antrianData.data.queue_number;
          console.log(`✅ New queue created: ${newQueueNumber}`);

          // Update with new queue number
          await DoctorAppointmentAPI.updateMedicineType(
            queue.NOP,
            medicineType,
            newQueueNumber
          );
        }

        // === 2. Update all statuses (order matters!)
        
        // First: Update verification status
        await updateButtonStatus(queue.NOP, "completed_verification");
        
        // Wait a bit to ensure DB update completes
        await new Promise(resolve => setTimeout(resolve, 300));

        // Second: Update pharmacy status
        await PharmacyAPI.updatePharmacyTask(queue.NOP, {
          status: "waiting_medicine",
          medicine_type: medicineType,
        });

        // Third: Update doctor appointment medicine status
        await DoctorAppointmentAPI.updateStatusMedicine(queue.NOP, medicineType);
        let lokasi;
        if(location == "bpjs"){
          lokasi = "Lantai 1 BPJS"
        }
        else if ( location = "gmcb"){
          lokasi = "Lantai 1 GMCB"
        }
        else{
          lokasi = "Lantai 3 GMCB"
        }
        // === 3. Create/ensure medicine task exists
        await MedicineAPI.createMedicineTask({
          NOP: queue.NOP,
          Executor: null,
          Executor_Names: null,
          status: "waiting_medicine",
          lokasi: lokasi,
        });

        // === 4. Get fresh data after all updates
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(queue.NOP);
        
        if (!doctorResponse?.data) {
          throw new Error("Failed to fetch updated appointment data");
        }

        console.log("Updated doctor data:", doctorResponse.data);

        // === 5. Prepare payloads
        const waPayload = {
          phone_number: doctorResponse.data.phone_number || "-",
          patient_name: doctorResponse.data.patient_name,
          NOP: doctorResponse.data.NOP,
          queue_number: doctorResponse.data.queue_number || newQueueNumber,
          medicine_type: medicineType, // Use the new medicine type
          sep: doctorResponse.data.sep_no || "-",
          rm: doctorResponse.data.medical_record_no || "-",
          docter: doctorResponse.data.doctor_name || "-",
          nik: doctorResponse.data.nik || "-",
          prev_queue_number: queue.queue_number || "-",
          switch_WA: localStorage.getItem('waToggleState') || "true",
          location: location
        };

        const printPayload = {
          phone_number: doctorResponse.data.phone_number || "-",
          barcode: doctorResponse.data.NOP,
          patient_name: doctorResponse.data.patient_name ||"-",
          farmasi_queue_number: doctorResponse.data.queue_number || newQueueNumber,
          medicine_type: medicineType, // Use the new medicine type
          SEP: doctorResponse.data.sep_no || "-",
          tanggal_lahir: queue.patient_date_of_birth 
            ? new Date(queue.patient_date_of_birth).toISOString().split('T')[0]
            : null,
          queue_number: doctorResponse.data.queue_number || newQueueNumber,
          doctor_name: doctorResponse.data.doctor_name || "-",
          lokasi: location
        };

        // === 6. Send WA notification
        console.log("Sending WA notification:", waPayload, printPayload);
        const sendResponse = await WA_API.sendWAVerif(waPayload);
        console.log("WA sent:", sendResponse);

        // Delay before printing
        await new Promise(resolve => setTimeout(resolve, 1000));

        // === 7. Print slip
        console.log("Printing slip:", printPayload);
        const printResp = await PrintAntrian.printAntrian(printPayload);
        console.log("Print response:", printResp);

        results.success.push(queue.NOP);
        
      } catch (error) {
        console.error(`❌ Error processing ${queue.NOP}:`, error);
        results.failed.push({
          NOP: queue.NOP,
          queue_number: queue.queue_number,
          error: error.message
        });
      }
    }

    // === 8. Reset selections only if at least one succeeded
    if (results.success.length > 0) {
      setSelectedQueue2([]);
      setSelectedQueueIds([]);

      // === 9. Emit socket events with delay to ensure updates propagate
      await new Promise(resolve => setTimeout(resolve, 500));
      
      socket.emit("update_proses", { location });
      socket.emit("update_verif", { location });
      socket.emit("update_display", { location });
    }

    // === 10. Show results
    if (results.failed.length === 0) {
      Swal.fire({
        icon: "success",
        title: `Berhasil memperbarui ${results.success.length} antrian ke ${medicineType}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: `Berhasil: ${results.success.length}, Gagal: ${results.failed.length}`,
        html: `
          <div style="text-align: left; max-height: 200px; overflow-y: auto;">
            <strong>Gagal:</strong><br/>
            ${results.failed.map(f => `${f.queue_number} (${f.NOP}): ${f.error}`).join('<br/>')}
          </div>
        `,
        confirmButtonText: "OK"
      });
    }

  } catch (error) {
    console.error("❌ Critical error in bulk pharmacy update:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal memperbarui data!",
      text: error.message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
};

  const handleScanResult = (data) => {
    console.log("📡 Hasil Scan diterima:", data);
    setScanResult(data);
    setIsDeleted(false);
  };
  useEffect(() => {
    if (isDeleted) {
      console.log("🗑️ Mengosongkan scan input...");
      setScanResult("");
    }
  }, [isDeleted]);
  return (
    <div>
     <BarcodeScanner location={location}onScanResult={handleScanResult} handleBulkPharmacyUpdate = {handleBulkPharmacyUpdate} />

        <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
       
      {/* ✅ Tombol baru untuk memanggil banyak nomor sekaligus */}
      <Button
  variant="contained"
  sx={{ backgroundColor: "#4CAF50", color: "#ffffff", fontWeight: "bold", padding: "15px", height: "60px", fontSize: "1rem" }}
  onClick={handleBulkCall}
  disabled={selectedQueueIds.length === 0} // ⬅️ Pastikan hanya disable jika kosong
>
  PANGGIL {selectedQueueIds?.length || 0} NOMOR
</Button>


     {/* ✅ Pending banyak nomor */}
     <Button
      variant="contained"
      sx={{ backgroundColor: "#FF9800", color: "#ffffff", fontWeight: "bold", padding: "10px", height: "60px", fontSize: "1rem" }}
      onClick={() => handleBulkStatusUpdate("pending_verification")}
      disabled={selectedQueueIds.length === 0}
    >
      PENDING
    </Button>

     {/* ✅ Panggil ulang banyak nomor */}
     <Button
      variant="contained"
      sx={{ backgroundColor: "#FFD700", color: "#000000", fontWeight: "bold", padding: "12px", height: "60px", fontSize: "1rem", width: "100%" }}
      onClick={() => handleBulkStatusUpdate("recalled_verification")}
      disabled={selectedQueueIds.length === 0}
    >
      PANGGIL ULANG
    </Button>

        {/* ✅ Proses Verifikasi banyak nomor */}
    <Button
      variant="contained"
      sx={{ backgroundColor: "#1E88E5", color: "#ffffff", fontWeight: "bold", padding: "12px", height: "55px", fontSize: "0.95rem" }}
      onClick={() => handleBulkStatusUpdate("processed_verification")}
      disabled={selectedQueueIds.length === 0}
    >
      PROSES VERIFIKASI
    </Button>

      {/* ✅ Racikan banyak nomor */}
    <Button
      variant="contained"
      sx={{ backgroundColor: "#8E24AA", color: "#ffffff", fontWeight: "bold", padding: "12px", height: "55px", fontSize: "0.95rem" }}
      onClick={() => handleBulkPharmacyUpdate("Racikan")}
      disabled={selectedQueueIds.length === 0}
    >
      RACIKAN
    </Button>

     {/* ✅ Non-Racikan banyak nomor */}
     <Button
      variant="contained"
      sx={{ backgroundColor: "#FF4081", color: "#ffffff", fontWeight: "bold", padding: "12px", height: "55px", fontSize: "0.95rem" }}
      onClick={() => handleBulkPharmacyUpdate("Non - Racikan")}
      disabled={selectedQueueIds.length === 0}
    >
      NON - RACIKAN
    </Button>
  </Box>
    </div>
    
  );
};

export default PilihAksi;
