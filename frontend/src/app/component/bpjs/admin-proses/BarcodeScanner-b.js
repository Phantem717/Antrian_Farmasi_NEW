"use client";

import React, { useState, useEffect, useRef } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode"; // ✅ Import API BPJS
import PickupAPI from "@/app/utils/api/Pickup"; // ✅ Import API Pickup
import PharmacyAPI from "@/app/utils/api/Pharmacy"; // ✅ Import API Pharmacy
import MedicineAPI from "@/app/utils/api/Medicine"; // ✅ Gunakan API Medicine
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";
export default function BarcodeScanner({ onScanResult, daftarAntrian }) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

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

            console.log("📡 Booking ID yang di-scan:", inputValue);

            try {
                // 🔹 STEP 1: Switch Medicine to Pickup di BPJS
                // await BPJSBarcodeAPI.switchMedicineToPickup(NOP);
                // console.log("✅ BPJS Switch Medicine berhasil.");
            
                // 🔹 Ambil medicine_type dari daftar antrian berdasarkan NOP
                const foundItem = daftarAntrian.find(item => item.NOP === NOP);
                const medicineType = foundItem ? foundItem.medicine_type : "Non - Racikan"; // Default jika tidak ditemukan
                
                MedicineAPI.updateMedicineTask(NOP, { Executor: null,
                    Executor_Names: null,
                    status: "completed_medicine", 
                    loket: "Loket 3"});
                    
                // 🔹 STEP 2: Create Pickup Task
                const pickupResponse = await PickupAPI.createPickupTask({
                    NOP: NOP,
                    Executor: null,
                    Executor_Names: null,
                    status: "waiting_pickup_medicine",
                    lokasi:"Lantai 1 BPJS"
                });
                console.log("✅ Pickup Task berhasil dibuat:", pickupResponse);
            
                // 🔹 STEP 3: Update Pharmacy Task dengan status dan medicine_type
                const pharmacyResponse = await PharmacyAPI.updatePharmacyTask(NOP, {
                    status: "waiting_pickup_medicine",
                    medicine_type: medicineType
                });
                console.log("✅ Pharmacy Task berhasil diperbarui:", pharmacyResponse);
                
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
                    nik: doctorResponse.data.nik ?? "-"


                }
                const sendResponse = await WA_API.sendWAProses(payload);
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
                }).then(()=>{
    onScanResult(NOP);
                setInputValue("");
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
