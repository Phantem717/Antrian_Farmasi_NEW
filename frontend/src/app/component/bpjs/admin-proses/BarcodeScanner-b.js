"use client";

import React, { useState, useEffect, useRef } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode"; // ? Import API BPJS
import PickupAPI from "@/app/utils/api/Pickup"; // ? Import API Pickup
import PharmacyAPI from "@/app/utils/api/Pharmacy"; // ? Import API Pharmacy
import MedicineAPI from "@/app/utils/api/Medicine"; // ? Gunakan API Medicine
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";
import {getSocket} from "@/app/utils/api/socket";

export default function BarcodeScanner({location, onScanResult }) {
    const [inputValue, setInputValue] = useState("");
    const [daftarAntrian, setDaftarAntrian] = useState([]);
     
    const inputRef = useRef(null);
    const socket = getSocket();
     const getShortLocation = (loc) => {
        const locationMap = {
            "Lantai 1 BPJS": "bpjs",
            "Lantai 1 GMCB": "gmcb",
            "Lantai 3 GMCB": "lt3"
        };
        return locationMap[loc] || loc;
    };
    const fetchDaftarAntrianList = async () => {
        try {
            const response = await PharmacyAPI.getAllPharmacyTasksByStatus(location,"waiting_medicine");
            console.log("?? Data antrian dari API:", response.data);
            setDaftarAntrian(response.data);
        } catch (error) {
            console.error("? Error fetching queue list:", error);
        }
    };

    useEffect(() => {
        inputRef.current.focus();
            const shortLocation = getShortLocation(location);
    socket.emit('join_room', { location: shortLocation });
    console.log(`🚪 [DaftarAntrian-Proses] Joined room_${shortLocation}`);
    
        fetchDaftarAntrianList();


        // Set up socket listeners
        socket.on('update_daftar_pickup', fetchDaftarAntrianList,console.log("UPDATED VERIF PROSES"));
        socket.on('update_display', () => console.log("EMIT UPDATE"));

        // Clean up socket listeners on unmount
        return () => {
            socket.off('update_daftar_pickup', fetchDaftarAntrianList);
            socket.off('update_display');
        };
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

            console.log("?? Booking ID yang di-scan:", NOP);

            try {
                const foundItem = daftarAntrian.find(item => item.NOP === NOP);
                if (!foundItem) {
                    Swal.fire({
                        icon: "info",
                        title: "Data Tidak Ditemukan",
                        text: `Booking ID ${NOP} tidak ditemukan dalam daftar antrian.`,
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    return;
                }
                
                const medicineType = foundItem.medicine_type || "Non - Racikan";
                
                const medResp = await MedicineAPI.updateMedicineTask(NOP, {
                    Executor: null,
                    Executor_Names: null,
                    status: "completed_medicine", 
                    loket: "Loket 1"
                });
                
                console.log("MEDRESP", medResp);
                
                const pickupResponse = await PickupAPI.createPickupTask({
                    NOP: NOP,
                    Executor: null,
                    Executor_Names: null,
                    status: "waiting_pickup_medicine",
                    lokasi: location
                });
                console.log("? Pickup Task berhasil dibuat:", pickupResponse);
            
                const pharmacyResponse = await PharmacyAPI.updatePharmacyTask(NOP, {
                    status: "waiting_pickup_medicine",
                    medicine_type: medicineType
                });
                console.log("? Pharmacy Task berhasil diperbarui:", pharmacyResponse);
                
                const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(NOP);
                console.log("DOCRESP", doctorResponse);
               
                socket.emit('update_display',{location});
                socket.emit('update_proses',{location});

                socket.emit('update_pickup',{location});

                Swal.fire({
                    icon: "success",
                    title: "Proses Berhasil!",
                    text: `Booking ID ${NOP} berhasil diproses.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
                
                // Update local state by removing the processed item
                setDaftarAntrian(prev => prev.filter(item => item.NOP !== NOP));
                onScanResult(NOP);
                setInputValue("");
                inputRef.current.focus();
            } catch (error) {
                console.error("? Error saat memproses scan:", error);
                console.error("?? Detail Error:", error.response?.data || error.message);
            
                Swal.fire({
                    icon: "error",
                    title: "Gagal Memproses!",
                    text: `${error.response?.data?.message || error.message}`,
                    timer: 2000,
                    showConfirmButton: false,
                }).then(() => {
                    onScanResult(NOP);
                    setInputValue("");
                });
            }
        }
    };

    return (
        <Box sx={{ textAlign: "center", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
            <Typography variant="h6">Masukkan Barcode / QR Code</Typography>
            <TextField
                inputRef={inputRef}
                label="Tekan Enter untuk Scan"
                variant="outlined"
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ marginTop: "10px" }}
            />
        </Box>
    );
}