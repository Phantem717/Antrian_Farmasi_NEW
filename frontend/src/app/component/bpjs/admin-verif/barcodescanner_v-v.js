"use client";
import { updateButtonStatus } from "@/app/utils/api/Button";

import React, { useState, useEffect, useRef } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode"; // ✅ Import API BPJS
import PickupAPI from "@/app/utils/api/Pickup"; // ✅ Import API Pickup
import PharmacyAPI from "@/app/utils/api/Pharmacy"; // ✅ Import API Pharmacy
import MedicineAPI from "@/app/utils/api/Medicine"; // ✅ Gunakan API Medicine
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";
export default function BarcodeScanner({ onScanResult , handleBulkPharmacyUpdate}) {
    const [inputValue, setInputValue] = useState("");
   
    const inputRef = useRef(null);
const [daftarAntrian,setDaftarAntrian] = useState([]);
    useEffect(() => {
        const fetchQueueList = async () => {
          try {
            const response = await PharmacyAPI.getAllPharmacyTasks();
            console.log("COCKET 📡 Data antrian dari API SOCKET:", response.data);
            setDaftarAntrian(response.data);
          } catch (error) {
            console.error("❌ Error fetching queue list:", error);
          }
        };
    
        fetchQueueList();
        const interval = setInterval(fetchQueueList, 10000); // Refresh tiap 10 detik
        return () => clearInterval(interval);
      }, []);
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            const NOP = event.target.value.trim();
            if (!NOP) {
                Swal.fire({
                    icon: "warning",
                    title: "Input Kosong!",
                    text: "Silakan masukkan Booking ID.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            console.log("📡 Booking ID yang di-scan:", NOP);

            try {
                // 🔹 STEP 1: Switch Medicine to Pickup di BPJS
               
                // 🔹 Ambil medicine_type dari daftar antrian berdasarkan NOP
                const foundItem = daftarAntrian.find(item => item.NOP === NOP);
                console.log("FOUND ITEM",foundItem);
                    await updateButtonStatus(NOP, "completed_verification");

                    await handleBulkPharmacyUpdate(foundItem.status_medicine);
                    const pharResp= await PharmacyAPI.updatePharmacyTask(foundItem.NOP, {
                      status: "waiting_medicine",
                      medicine_type: foundItem.status_medicine,
                    });

                    console.log("PHARMACY RESP",pharResp);
                    
                      await MedicineAPI.createMedicineTask({
                                NOP: foundItem.NOP,
                                Executor: null,
                                Executor_Names: null,
                                status: "waiting_medicine",
                                lokasi: "Lantai 1 BPJS"
                              });
                  
                 
                  const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(NOP);
                  console.log("DOCRESP",doctorResponse);
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
                }
                const sendResponse = await WA_API.sendWAVerif(payload);

                console.log("WA SENT",sendResponse);

                Swal.fire({
                    icon: "success",
                    title: "Proses Berhasil!",
                    text: `Booking ID ${NOP} berhasil diproses.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            
                onScanResult(NOP);
                setInputValue("");
                inputRef.current.focus();
            } catch (error) {
                console.error("❌ Error saat memproses scan:", error);
                console.error("🔍 Detail Error:", error.response?.data || error.message);
            
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memproses!",
                    text: `Terjadi kesalahan saat memproses Booking ID ${NOP}.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
            
        }
    };

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <Box sx={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <Typography variant="h6">Masukkan Barcode / QR Code</Typography>
            <TextField
                    inputRef={inputRef}
                    label="Tekan Enter untuk Scan"
                    variant="outlined"
                    fullWidth
                    value={inputValue}  // <-- Pastikan nilai input dikontrol
                    onChange={(e) => setInputValue(e.target.value)} // <-- Update state saat user mengetik
                    onKeyDown={handleKeyDown}
                    sx={{ marginTop: "10px" }}
                />

        </Box>
    );
}
