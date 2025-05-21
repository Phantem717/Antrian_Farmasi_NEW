"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import MedicineAPI from "@/app/utils/api/Medicine"; // ✅ Gunakan API Medicine
export default function DaftarAntrian({ scanResult, setIsDeleted }) {
    const [queueList, setQueueList] = useState([]); // Data antrian dari API
    const [loading, setLoading] = useState(true);

    // 🔄 Ambil daftar antrian dari `MedicineAPI` dan hanya tampilkan yang `waiting_medicine`
    useEffect(() => {
        const fetchQueue = async () => {
            setLoading(true);
            try {
                const response = await MedicineAPI.getAllMedicineTasks();
                console.log("📡 Data dari API:", response);

                if (response && Array.isArray(response.data)) {
                    const formattedData = response.data
                        .filter(item => {
                            // Ensure item exists and has required properties
                            if (!item ) return false;
                            
                            const medicineStamp = typeof item.waiting_medicine_stamp == "string" ? new Date(item.waiting_medicine_stamp) : item.waiting_medicine_stamp
                            const medicineDateString = medicineStamp.toISOString().split('T')[0];
                            const dateString = new Date().toISOString().split('T')[0];

                            // Check status and location with null checks
                            const statusMatch = item.status === "waiting_medicine";
                            const locationMatch = item.lokasi === "Lantai 1 BPJS";
                            const dateMatch = medicineDateString == dateString;

                            
                            return statusMatch && locationMatch && dateMatch;
                        }) // ✅ Hanya tampilkan `waiting_medicine`
                        .map((item) => ({
                            booking_id: item.booking_id,
                            patient_name: item.patient_name || "Tidak Diketahui",
                            medical_record_no: item.medical_record_no || "Tidak Diketahui",
                            status: item.status || "Menunggu",
                            medicine_type: item.medicine_type !== "Empty" ? item.medicine_type : "Belum Ditentukan",
                        }));

                    setQueueList(formattedData);
                } else {
                    console.error("❌ Respons tidak valid atau tidak memiliki properti data");
                    setQueueList([]);
                }
            } catch (error) {
                console.error("❌ Gagal mengambil data antrian:", error);
                setQueueList([]);
            }
            setLoading(false);
        };

        fetchQueue();
    }, []);

    // 🔄 Perbarui daftar antrean setelah scan berhasil
    useEffect(() => {
        if (scanResult) {
            console.log("📡 Scan Result diterima:", scanResult);

            const isExist = queueList.some((item) => item.booking_id === scanResult);

            if (isExist) {
                console.log(`✅ Booking ID ${scanResult} ditemukan, menghapus dari antrian.`);

                // ✅ Hapus hanya antrean yang diproses dan update daftar
                setQueueList((prevList) => prevList.filter((item) => item.booking_id !== scanResult));

                Swal.fire({
                    icon: "success",
                    title: "Antrian Dihapus",
                    text: `Booking ID ${scanResult} telah diproses.`,
                    timer: 1500,
                    showConfirmButton: false,
                });

                setIsDeleted(true);
            } else {
                console.log(`❌ Booking ID ${scanResult} tidak ditemukan.`);
                Swal.fire({
                    icon: "error",
                    title: "Nomor Tidak Ditemukan",
                    text: `Booking ID ${scanResult} tidak ada dalam daftar.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        }
    }, [scanResult]);

    return (
        <Box sx={{ padding: "10px" }}>
            <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
                Daftar Antrian Farmasi (Waiting Medicine)
            </Typography>

            <Paper elevation={3} sx={{ padding: "10px" }}>
                <Box sx={{ maxHeight: "650px", overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Booking ID</strong></TableCell>
                                <TableCell align="center"><strong>Nama Pasien</strong></TableCell>
                                <TableCell align="center"><strong>No. Rekam Medis</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Jenis Obat</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : queueList.length > 0 ? (
                                queueList.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{item.booking_id}</TableCell>
                                        <TableCell align="center">{item.patient_name}</TableCell>
                                        <TableCell align="center">{item.medical_record_no}</TableCell>
                                        <TableCell align="center">{item.status}</TableCell>
                                        <TableCell align="center">{item.medicine_type}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">🚫 Tidak ada antrean waiting_medicine.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        </Box>
    );
}
