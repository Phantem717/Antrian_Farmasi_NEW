//src\app\component\admin-obat\DaftarAntrian.js
"use client";
import { io, Socket } from 'socket.io-client';

import React, { useState, useEffect,useRef } from "react";
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
  Input,
  TextField
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
import DataTable from "datatables.net-dt";
import $ from 'jquery';
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import "datatables.net-dt/css/dataTables.dataTables.css";
import { Form } from "antd";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

import { getSocket } from '@/app/utils/api/socket';
const DaftarAntrian = ({ selectedQueueIds, setSelectedQueueIds, setSelectedQueue, setSelectedLoket,setSelectedQueue2,selectedQueue2 }) => {
    const [searchText, setSearchText] = useState('');
 dayjs.extend(customParseFormat);
  const dateFormat="YYYY-MM-DD"
  const [rawQueueList,setRawQueueList]= useState([]);
  const [queueList, setQueueList] = useState([]);
  const [lokets, setLokets] = useState([]);
  const [selectedLoketLocal, setSelectedLoketLocal] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [date,setDate]= useState("");
  const socket = getSocket();
  // Run this whenever queueList changes
  // ? Loket yang diizinkan untuk admin obat
  const allowedLokets = ["Loket 3", "Loket 4"];
  async function deleteAction() {
    if (!selectedQueue2 || !selectedQueueIds || selectedQueueIds.length === 0) {
      console.log("Queues Needed");
      return;
    }
  
    try {
      for (const NOP of selectedQueueIds) {
        await DoctorAppointmentAPI.deleteAppointment(NOP);
        await VerificationAPI.deleteVerificationTask(NOP);
        await PharmacyAPI.deletePharmacyTask(NOP);
        await MedicineAPI.deleteMedicineTask(NOP);
        await PickupAPI.deletePickupTask(NOP);
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

  
async function getInitalData(){
    const response = await PickupAPI.getAllPickupTasks();
    processQueue(response);
}
  const processQueue = async (response) => {
    if (!selectedLoketLocal && !selectedStatus) return;

    try {
      
      let filteredQueues = response.data.filter((item) => {
        if (!item || !item.status || item.waiting_pickup_medicine_stamp === undefined) {
          return false;
        }
        
        const verificationStamp = typeof item.waiting_pickup_medicine_stamp === 'string' 
          ? new Date(item.waiting_pickup_medicine_stamp) 
          : item.waiting_pickup_medicine_stamp;

        const verifDateString = verificationStamp.toISOString().split('T')[0];
        
        // If date filter is applied, check against it
        if (date) {
          const filterDateString = new Date(date).toISOString().split('T')[0];
          return item.status.toLowerCase() === selectedStatus.toLowerCase() && 
                 verifDateString === filterDateString;
        }
        
        // If no date filter, use today's date
        const todayString = new Date().toISOString().split('T')[0];
        return item.status.toLowerCase() === selectedStatus.toLowerCase() && 
               verifDateString === todayString;
      });
const getEarliestTimestamp = (item) => {
        const timestamps = [
          item.waiting_pickup_medicine_stamp,
          item.called_pickup_medicine_stamp,
          item.recalled_pickup_medicine_stamp,
          item.pending_pickup_medicine_stamp,
          item.completed_pickup_medicine_stamp,
        ]
          .filter(Boolean)
          .map((ts) => new Date(ts).getTime());

        return timestamps.length > 0 ? Math.min(...timestamps) : Infinity;
      };
      // Sort l
      // Rest of your sorting logic...
      filteredQueues = filteredQueues.sort(
        (a, b) => getEarliestTimestamp(a) - getEarliestTimestamp(b)
      );

      console.log("QUEUELIST",filteredQueues);
      setRawQueueList(filteredQueues);
      
      if (!searchText) {
        setQueueList(filteredQueues);
      } else {
        const filtered = filteredQueues.filter(item =>
          item.patient_name?.toLowerCase().includes(searchText.toLowerCase())
        );
        setQueueList(filtered);
      }

    } catch (error) {
      console.error("Error fetching queue list:", error);
    }
  };
useEffect(() => {
  getInitalData();
  socket.on('get_responses_pickup',(payload)=>{
    processQueue(payload);
  })

  
}, [selectedStatus, selectedLoketLocal, date]); // Add date to dependencies

// Add a clear date function
const handleClearDate = () => {
  setDate(null);
};

const changeDate = (date,dateString) => {
  console.log("date",date,dateString);
  setDate(dateString);
}
  // ? Fungsi memilih / membatalkan pilihan nomor antrian
  const handleSelectQueue = (queueId, queueData) => {
    console.log("SELECTED",queueId,queueData)
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
      const exists = prevSelected.some((item) => item.NOP === queueId); // adjust if the key isn't 'id'
    
      const newSelection = exists
        ? prevSelected.filter((item) => item.NOP !== queueId)
        : [...prevSelected, queueData]; // push the whole object
    
      if (newSelection.length > 0) {
        setSelectedQueue(queueData);
      } else {
        setSelectedQueue(null);
      }
    
      return newSelection;
    });
    
  };
  

  useEffect(() => {
  if (!searchText) {
    setQueueList(rawQueueList);
  } else {
    const filtered = rawQueueList.filter(item =>
      item.patient_name?.toLowerCase().includes(searchText.toLowerCase())
    );
    setQueueList(filtered);
  }
}, [searchText, rawQueueList]);
const handleSearch = (searchText) => {
  setSearchText(searchText);
  // No need to manually filter here - the useEffect will handle it
};

const handleSearchClear = () => {
  setSearchText('');
  // The useEffect will automatically reset to rawQueueList
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

  <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <div className="w-[200px] z-10">
  <DatePicker 
              size="large"

            onChange={changeDate} 
            disabled={!selectedStatus}
                maxDate={dayjs(new Date().toISOString(), dateFormat)}
                defaultValue={dayjs(new Date().toISOString(), dateFormat)}

            />  </div>
  {date && (
    <Button
      variant="outlined"
      onClick={handleClearDate}
      sx={{ height: '40px' }}
    >
      Clear
    </Button>
  )}
</Box>

        <Box sx={{ display: "flex", gap: "10px", zIndex:"0"}}>
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
        sx={{ padding: "10px", maxHeight: "600px", overflow: "auto" }}
      >
        <div style={{ width: '100%', display: 'flex' }}>
          <Form
            layout="inline"
            onFinish={() => handleSearch(searchText)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'nowrap'
            }}
          >
            <Form.Item 
              style={{ 
                flex: '1',
                margin: 0,
                minWidth: 0, // Crucial for proper flex behavior
              }}
            >
              <Input
                placeholder="Search patients"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                suffix={<SearchOutlined />}
                style={{ width: '100%' }}
              />
            </Form.Item>
        
            <Form.Item style={{ 
              margin: 0,
              flex: '0 0 auto' // Prevents shrinking
            }}>
              <Button
                type="default"
                onClick={handleSearchClear}
                icon={<CloseOutlined />}
                style={{ whiteSpace: 'nowrap' }}
              >
                Clear
              </Button>
            </Form.Item>
          </Form>
        </div>
        
       {queueList.length > 0 && (
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
                <TableCell align="center">
                <strong>Timestamp</strong>
              </TableCell>
            </TableRow>
          </TableHead>

        <TableBody>
      {queueList.map((item) => (
                  // console.log("KEY2",item.NOP),

        <TableRow key={item.NOP} hover>
          <TableCell align="center">
            <Checkbox
              checked={selectedQueueIds.includes(item.NOP)}
              onChange={() => handleSelectQueue(item.NOP, item)}
            />
          </TableCell>
                <TableCell align="center">{item.queue_number}</TableCell>
                <TableCell align="center">{item.NOP}</TableCell>
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
                 <TableCell align="center">
                                                            {item.waiting_pickup_medicine_stamp ? new Date(item.waiting_pickup_medicine_stamp).toLocaleString("id-ID", {
                                                                dateStyle: "medium",
                                                                timeStyle: "short",
                                                            }) : "-"}
                                                        </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       )}
      </Paper>
    </Box>
  );
};

export default DaftarAntrian;
