"use client";

import React, { useState, useEffect, useRef } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode";
import PickupAPI from "@/app/utils/api/Pickup";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import MedicineAPI from "@/app/utils/api/Medicine";
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";
import { getSocket } from "@/app/utils/api/socket";
import { updateButtonStatus } from "@/app/utils/api/Button";

export default function BarcodeScanner({location, onScanResult, handleBulkPharmacyUpdate }) {
    const [inputValue, setInputValue] = useState("");
    const [daftarAntrian, setDaftarAntrian] = useState([]);
    const inputRef = useRef(null);
    const socket = getSocket();

    // Retry mechanism with exponential backoff
    const retryOperation = async (operation, maxRetries = 3, initialDelay = 1000) => {
        let attempt = 0;
        let delay = initialDelay;
        
        while (attempt < maxRetries) {
            try {
                return await operation();
            } catch (error) {
                attempt++;
                if (attempt >= maxRetries) throw error;
                
                console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            }
        }
    };

    const fetchQueueList = async () => {
        try {
            const response = await PharmacyAPI.getAllPharmacyTasksByStatus(location,"waiting_verification");
            console.log("Data antrian dari API:", response.data);
            setDaftarAntrian(response.data);
        } catch (error) {
            console.error("Error fetching queue list:", error);
        }
    };

    useEffect(() => {
        inputRef.current.focus();
        fetchQueueList();

        // Set up socket listeners
        socket.on('update_daftar_verif', fetchQueueList);
        socket.on('update_display', () => console.log("Display update received"));

        // Clean up socket listeners on unmount
        return () => {
            socket.off('update_daftar_verif', fetchQueueList);
            socket.off('update_display');
        };
    }, []);

    const processScan = async (NOP) => {
        const foundItem = daftarAntrian.find(item => item.NOP === NOP);
        
        if (!foundItem) {
            throw new Error(`Booking ID ${NOP} tidak ditemukan dalam daftar antrian.`);
        }

        // Update button status
        await updateButtonStatus(NOP, "completed_verification");

        // Handle bulk pharmacy update
        await handleBulkPharmacyUpdate(foundItem.status_medicine);

        // Update pharmacy task
        const pharResp = await PharmacyAPI.updatePharmacyTask(foundItem.NOP, {
            status: "waiting_medicine",
            medicine_type: foundItem.status_medicine,
        });
        console.log("Pharmacy response:", pharResp);

        // Create medicine task
        const medResp = await MedicineAPI.createMedicineTask({
            NOP: foundItem.NOP,
            Executor: null,
            Executor_Names: null,
            status: "waiting_medicine",
            lokasi: location
        });
        console.log("Medicine response:", medResp);

        // Get doctor appointment details
        const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(NOP);
        console.log("Doctor response:", doctorResponse);

        // Prepare WA payload
        const payload = {

            phone_number: doctorResponse.data.phone_number,
            patient_name: doctorResponse.data.patient_name,
            NOP: doctorResponse.data.NOP,
            queue_number: doctorResponse.data.queue_number,
            medicine_type: doctorResponse.data.status_medicine,
            sep: doctorResponse.data.sep_no,
            rm: doctorResponse.data.medical_record_no,
            docter: doctorResponse.data.doctor_name,
            nik: doctorResponse.data.nik || "-",
            prev_queue_number: "-",
            switch_WA: localStorage.getItem('waToggleState') || "true",
            location: location

        };

        // Send WA notification with retry
                setDaftarAntrian(prev => prev.filter(item => item.NOP !== NOP));
            console.log("WA_PAYLOAD1",payload)

        const sendResponse = await retryOperation(() => WA_API.sendWAVerif(payload));
        console.log("WA response:", sendResponse);

        // Emit socket events
       
        // Update local state by removing processed item
        socket.emit('update_display',{location});
        socket.emit('update_proses', {location} );
        socket.emit('update_pickup', {location} );
        socket.emit('update_verif', {location} );
        return { success: true };
    };

    const handleKeyDown = async (event) => {
        if (event.key !== "Enter") return;

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

        console.log("Booking ID yang di-scan:", NOP);

        try {
            await processScan(NOP.replace(/\t/g, "").trim());

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
            console.error("Error saat memproses scan:", error);
            
            Swal.fire({
                icon: "error",
                title: "Gagal Memproses!",
                text: error.response?.data?.message || error.message,
                timer: 2000,
                showConfirmButton: false,
            }).then(() => {
                onScanResult(NOP);
                setInputValue("");
            });
        }
    };

    return (
        <Box sx={{ 
            textAlign: "center", 
            padding: "20px", 
            border: "1px solid #ddd", 
            borderRadius: "8px",
            backgroundColor: "background.paper"
        }}>
            <Typography variant="h6" gutterBottom>
                Masukkan Barcode / QR Code
            </Typography>
            <TextField
                inputRef={inputRef}
                label="Tekan Enter untuk Scan"
                variant="outlined"
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                sx={{ marginTop: "10px" }}
                autoComplete="off"
            />
        </Box>
    );
}