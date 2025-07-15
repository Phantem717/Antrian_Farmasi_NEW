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

const PilihAksi = ({ selectedQueueIds = [], setSelectedQueueIds, selectedQueue2 = [] , setSelectedQueue2}) => {  
  const [isDeleted, setIsDeleted] = useState(false); // ✅ Untuk menghapus input scanner
   const [scanResult, setScanResult] = useState(""); // ✅ Simpan hasil scan
 
  // ✅ Fungsi untuk memanggil banyak nomor antrian sekaligus
 console.log("QUEUE4",selectedQueue2);
  const socket = getSocket();
  useEffect(()=>{
   
    socket.on('connect',()=>{
console.log("PILIH TOMBOL CONNECTED");
    });

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
            socket.on("connect_error", (err) => {
              // the reason of the error, for example "xhr poll error"
              console.log(err.message);
            
              // some additional description, for example the status code of the initial HTTP response
              console.log(err.description);
            
              // some additional context, for example the XMLHttpRequest object
              console.log(err.context);
            });
            socket.on('queue_called', (payload) => {
              // the reason of the error, for example "xhr poll error"
              console.log("MEssage",payload.message,payload.data);
            
            });
            

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
      
              socket.emit('update_verif');

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
      console.log("📡 Memperbarui status RACIKAN/NON-RACIKAN untuk:", selectedQueue2, "dengan tipe:", medicineType);
      await handleBulkStatusUpdate("completed_verification"),

      await Promise.all(


        selectedQueue2.map(async (queue) => {
          
          if((queue.status_medicine == "Racikan" && medicineType == "Non - Racikan") || (queue.status_medicine == "Non - Racikan" && medicineType == "Racikan")){
            const antrianResp = await CreateAntrianAPI.createAntrian(medicineType);
            console.log("MEDTYPE",medicineType);
            console.log("ANTRIAN RESP",antrianResp);

            const antrianData = antrianResp.data
            console.log("ANTRIANDATA",antrianData);

            const updateMedTypeResp = await DoctorAppointmentAPI.updateMedicineType(queue.NOP,medicineType, antrianData.data.queue_number);
            console.log("UPDATE RESP",updateMedTypeResp);
            // const {phone_number,barcode,patient_name,farmasi_queue_number,medicine_type, SEP, tanggal_lahir,queue_number};

          
          }
          await PharmacyAPI.updatePharmacyTask(queue.NOP, {
                status: "waiting_medicine",
                medicine_type: medicineType,
              });
      
              await DoctorAppointmentAPI.updateStatusMedicine(queue.NOP, medicineType);
              const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(queue.NOP);
              // const checkMedicine = await MedicineAPI.getMedicineTaskByNOP(NOP);
    
                await MedicineAPI.createMedicineTask({
                  NOP: queue.NOP,
                  Executor: null,
                  Executor_Names: null,
                  status: "waiting_medicine",
                  lokasi: "Lantai 1 BPJS"
                });
            
              console.log("DOCRESP",doctorResponse);
              console.log("PREV QUEUE",queue.queue_number);
                                socket.emit('update_display', console.log("EMIT UPDATE"));

                   Swal.fire({
        icon: "success",
        title: `Berhasil memperbarui ${selectedQueueIds.length} antrian ke status ${medicineType}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      });

      socket.emit('update_proses');
            socket.emit('update_verif');

              const payload = {
                phone_number: doctorResponse.data.phone_number,
                patient_name: doctorResponse.data.patient_name,
                NOP: doctorResponse.data.NOP,
                queue_number: doctorResponse.data.queue_number,
                medicine_type : doctorResponse.data.status_medicine,
                sep: doctorResponse.data.sep_no,
                rm: doctorResponse.data.medical_record_no,
                docter: doctorResponse.data.doctor_name,
                nik: doctorResponse.data.nik,
                prev_queue_number: queue.queue_number || "-",

    
    
            }
              const sendResponse = await WA_API.sendWAVerif(payload);
                                await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

  const printPayload = {
              
              phone_number: queue.phone_number,
              barcode: queue.NOP,
              patient_name: queue.patient_name,
              farmasi_queue_number: queue.queue_number,
              medicine_type: medicineType,
              SEP: queue.sep_no,
              tanggal_lahir: queue.patient_date_of_birth,
              queue_number: queue.queue_number,
              docter: queue.doctor_name
            }
            const printResp = await PrintAntrian.printAntrian(printPayload);
            console.log("PRINT AFTER CHANGE",printResp);
              console.log("WA SENT",sendResponse);    

        })
      );
  
   
      setSelectedQueue2([]); // ✅ Reset pilihan setelah pemanggilan

      setSelectedQueueIds([]); // ✅ Reset setelah update
  
    } catch (error) {
      console.error("❌ Error saat memperbarui status RACIKAN/NON-RACIKAN:", error);
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
     <BarcodeScanner onScanResult={handleScanResult} handleBulkPharmacyUpdate = {handleBulkPharmacyUpdate} />

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
