//src\app\component\admin-obat\DaftarAntrian.js
"use client";
import { io } from 'socket.io-client';

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import PickupAPI from "@/app/utils/api/Pickup"; // ? Gunakan API Pickup
import LoketAPI from "@/app/utils/api/Loket"; // ? Gunakan API Loket
import DoctorAppointmentAPI from '@/app/utils/api/Doctor_Appoinment';
import PharmacyAPI from '@/app/utils/api/Pharmacy';
import VerificationAPI from '@/app/utils/api/Verification';
import MedicineAPI from '@/app/utils/api/Medicine';
import Swal from 'sweetalert2';
const DaftarAntrian = ({ selectedQueueIds, setSelectedQueueIds, setSelectedQueue, setSelectedLoket,setSelectedQueue2,selectedQueue2 }) => {


  const [queueList, setQueueList] = useState([]);
  const [lokets, setLokets] = useState([]);
  const [selectedLoketLocal, setSelectedLoketLocal] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // ? Loket yang diizinkan untuk admin obat
  const allowedLokets = ["Loket 3", "Loket 4"];
  async function deleteAction() {
    if (!selectedQueue2 || !selectedQueueIds || selectedQueueIds.length === 0) {
      console.log("Queues Needed");
      return;
    }
  
    try {
      for (const bookingId of selectedQueueIds) {
        await DoctorAppointmentAPI.deleteAppointment(bookingId);
        await VerificationAPI.deleteVerificationTask(bookingId);
        await PharmacyAPI.deletePharmacyTask(bookingId);
        await MedicineAPI.deleteMedicineTask(bookingId);
        await PickupAPI.deletePickupTask(bookingId);
      }
  
      // Clear selection after successful deletion
      setSelectedQueueIds([]);
       Swal.fire({
             icon: "success",
             title: `Antrian Berhasil Dihapus`,
             toast: true,
             position: "top-end",
             showConfirmButton: false,
             timer: 2000,
             timerProgressBar: true,
           });
     
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  }
  // ? Fetch Loket dari API
  useEffect(() => {
    const fetchLokets = async () => {
      try {
        const loketData = await LoketAPI.getAllLokets();
        const filteredLokets = loketData.data.filter((loket) => 
          allowedLokets.includes(loket.loket_name)
        );
        setLokets(filteredLokets);
  
        // ? Cek apakah ada loket yang aktif, lalu set sebagai selectedLoket
        const activeLoket = filteredLokets.find(loket => loket.status === "active");
        if (activeLoket) {
          setSelectedLoketLocal(activeLoket.loket_name);
          setSelectedLoket(activeLoket.loket_name);        }
  
      } catch (error) {
        console.error("? Error fetching lokets:", error);
      }
    };
  
    fetchLokets();
    const interval = setInterval(fetchLokets, 5000);
    return () => clearInterval(interval);
  }, []);
  

  const handleLoketChange = async (loketName) => {
    setSelectedLoketLocal(loketName);
    setSelectedLoket(loketName); // ? Sync ke Admin.js

    setSelectedQueue(null);
    setSelectedQueue2([]);

  // ? Cari ID Loket yang Dipilih
  const selectedLoketData = lokets.find((loket) => loket.loket_name === loketName);
  if (!selectedLoketData) {
    console.error("? Loket tidak ditemukan!");
    return;
  }

  const loketId = selectedLoketData.loket_id;

  try {
    // ? Hanya update loket yang dipilih menjadi "active"
    await LoketAPI.updateLoket(loketId, loketName, selectedLoketData.description, "active");
    for (const loket of lokets) {
          if (loket.loket_id !== loketId) {
            await LoketAPI.updateLoket(loket.loket_id, loket.loket_name, loket.description, "close");
          }
        }

    console.log(`? Loket ${loketName} diaktifkan.`);
  } catch (error) {
    console.error(`? Gagal memperbarui status loket:`, error);
  }
};

  
  // ? Fetch Daftar Antrian setelah memilih Loket
  useEffect(() => {
    if (!selectedLoketLocal) return;

    const fetchQueueList = async () => {
      try {
        const response = await PickupAPI.getAllPickupTasks();
        console.log("?? Data antrian dari API:", response.data);
        const now = new Date();

        let filteredQueues = response.data.filter((item) => {
          // Handle potential missing properties
          if (!item || !item.status || item.waiting_pickup_medicine_stamp === undefined) {
            return false;
          }
          
          // Convert string timestamps to Date objects if needed
          const verificationStamp = typeof item.waiting_pickup_medicine_stamp === 'string' 
            ? new Date(item.waiting_pickup_medicine_stamp) 
            : item.waiting_pickup_medicine_stamp;
          
          // Compare with case insensitivity
          return item.status.toLowerCase() === selectedStatus.toLowerCase() && 
                 verificationStamp <= now;
        });

         // ? Cek apakah ada nomor antrian yang sedang dipanggil
              const activeQueue = response.data.find(
                (item) => item.status === "called_verification"
              );
        
              // ? Jika ada dan belum punya loket, simpan loket yang memanggil
              if (activeQueue && !activeQueue.loket && selectedLoketLocal) {
                console.log(`??? Mengupdate loket ${selectedLoketLocal} untuk antrian ${activeQueue.queue_number}`);
              
                await VerificationAPI.updateVerificationTask(activeQueue.booking_id, {
                  loket: selectedLoketLocal,
                });
              
                console.log(`? Berhasil menyimpan loket ${selectedLoketLocal} untuk antrian ${activeQueue.queue_number}`);
              }
              
        // ? Urutkan berdasarkan timestamp yang paling lama
        const getEarliestTimestamp = (item) => {
          const timestamps = [
            item.waiting_pickup_stamp,
            item.called_pickup_stamp,
            item.recalled_pickup_stamp,
            item.pending_pickup_stamp,
            item.processed_pickup_stamp,
            item.completed_pickup_stamp,
          ]
            .filter(Boolean)
            .map((ts) => new Date(ts).getTime());

          return timestamps.length > 0 ? Math.min(...timestamps) : Infinity;
        };

        filteredQueues = filteredQueues.sort(
          (a, b) => getEarliestTimestamp(a) - getEarliestTimestamp(b)
        );

        console.log("?? Data antrian setelah diurutkan:", filteredQueues);
        setQueueList(filteredQueues);
      } catch (error) {
        console.error("? Error fetching queue list:", error);
      }
    };

    fetchQueueList();
    const interval = setInterval(fetchQueueList, 10000);
    return () => clearInterval(interval);
  }, [selectedStatus, selectedLoketLocal]);

  // ? Fungsi memilih / membatalkan pilihan nomor antrian
  const handleSelectQueue = (queueId, queueData) => {
    setSelectedQueueIds((prevSelected) => {
      const newSelection = prevSelected.includes(queueId)
        ? prevSelected.filter((id) => id !== queueId)
        : [...prevSelected, queueId];

      // ? Jika ada antrian yang dipilih, simpan ke selectedQueue
      if (newSelection.length > 0) {
        setSelectedQueue(queueData);
      } else {
        setSelectedQueue(null);
      }

      return newSelection;
    });

    setSelectedQueue2((prevSelected) => {
      const exists = prevSelected.some((item) => item.id === queueId); // adjust if the key isn't 'id'
    
      const newSelection = exists
        ? prevSelected.filter((item) => item.id !== queueId)
        : [...prevSelected, queueData]; // push the whole object
    
      if (newSelection.length > 0) {
        setSelectedQueue(queueData);
      } else {
        setSelectedQueue(null);
      }
    
      return newSelection;
    });
    
  };
  

  return (
    <Box sx={{ padding: "10px" }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
        Daftar Antrian Pengambilan Obat
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
      <Select
        value={selectedLoketLocal}
        onChange={(e) => handleLoketChange(e.target.value)}
        displayEmpty
        sx={{ width: "200px", marginRight: "10px" }}
      >
        <MenuItem value="" disabled>Pilih Loket</MenuItem>
        {lokets.map((loket) => (
          // console.log("Loket", loket.loket_id),
          <MenuItem key={loket.loket_id} value={loket.loket_name}>
            {loket.loket_name}
          </MenuItem>
        ))}
      </Select>


        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          displayEmpty
          sx={{ width: "200px", marginRight: "10px" }}
          disabled={!selectedLoketLocal}
        >
          <MenuItem value="waiting_pickup_medicine">Menunggu Panggilan</MenuItem>
          <MenuItem value="called_pickup_medicine">Panggil Pengambilan</MenuItem>
          <MenuItem value="recalled_pickup_medicine">Panggil Ulang Pengambilan</MenuItem>
          <MenuItem value="pending_pickup_medicine">Tunda Pengambilan</MenuItem>
          {/* <MenuItem value="processed_pickup_medicine">Processed Pickup</MenuItem> */}
        </Select>

        <Box sx={{ display: "flex", gap: "10px" }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ fontSize: "0.9rem", padding: "10px 15px" }}
          disabled={!selectedQueueIds || selectedQueueIds.length === 0} // ? Cek jika undefined
          onClick={()=>deleteAction()}
        >
          Hapus Antrian
        </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<RefreshIcon />}
            sx={{ fontSize: "0.9rem", padding: "10px 15px" }}
            onClick={()=>window.location.reload}
          >
            Refresh Antrian
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{ padding: "10px", maxHeight: "400px", overflow: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <strong>Pilih</strong>
              </TableCell>
              <TableCell align="center">
                <strong>No. Antrian</strong>
              </TableCell>
              <TableCell align="center">
                <strong>ID Booking</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Nama Pasien</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Nomor SEP</strong>
              </TableCell>
              <TableCell align="center">
                <strong>No. Rekam Medis</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Status Medicine</strong>
              </TableCell>
            </TableRow>
          </TableHead>

        <TableBody>
      {queueList.map((item) => (
                  // console.log("KEY2",item.booking_id),

        <TableRow key={item.booking_id} hover>
          <TableCell align="center">
            <Checkbox
              checked={selectedQueueIds.includes(item.booking_id)}
              onChange={() => handleSelectQueue(item.booking_id, item)}
            />
          </TableCell>
                <TableCell align="center">{item.queue_number}</TableCell>
                <TableCell align="center">{item.booking_id}</TableCell>
                <TableCell align="center">{item.patient_name}</TableCell>
                <TableCell align="center">{item.sep_no}</TableCell>
                <TableCell align="center">
                  {item.medical_record_no || "-"}
                </TableCell>
                <TableCell align="center">{item.status}</TableCell>
                <TableCell align="center">
                  {item.status_medicine === "Racikan"
                    ? "Racikan"
                    : item.status_medicine === "Non - Racikan" ? "Non - Racikan" : "Tidak Ada Resep"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default DaftarAntrian;
