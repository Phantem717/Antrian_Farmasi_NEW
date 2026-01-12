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
// import DataTable from "datatables.net-dt";
import $ from 'jquery';
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// import "datatables.net-dt/css/dataTables.dataTables.css";
import { Form } from "antd";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import PhoneEditForm from "@/app/component/bpjs/admin-obat/phoneEditForm_o";
import EditIcon from '@mui/icons-material/Edit';

import { getSocket } from '@/app/utils/api/socket';
const DaftarAntrian = ({location, selectedQueueIds, setSelectedQueueIds, setSelectedQueue, setSelectedLoket,setSelectedQueue2,selectedQueue2 }) => {
    const [searchText, setSearchText] = useState('');
    const [currentDate,setCurrentDate]= useState(new Date().getDate());
    const [phoneVisible,setPhoneVisible] = useState(false);
          const [phoneQueue, setPhoneQueue] =useState(null);
          
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
  const allowedLokets = ["Loket 1", "Loket 4"];
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
                 socket.emit('update_display');
      socket.emit('update_pickup');

     
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  }
  // ? Fetch Loket dari API
    let isMounted = true; // Track if component is mounted

  const fetchLokets = async () => {
    try {
      const loketData = await LoketAPI.getAllLokets();
      if (!isMounted) return; // Don't update if unmounted

      const filteredLokets = loketData.data.filter((loket) => 
        allowedLokets.includes(loket.loket_name)
      );
      
      setLokets(filteredLokets);

      // Only update selected loket if we don't already have one selected
      // or if the current selection is no longer active
      const activeLoket = filteredLokets.find(loket => loket.status === "active");
      if (activeLoket) {
        setSelectedLoketLocal(prev => prev || activeLoket.loket_name);
        setSelectedLoket(prev => prev || activeLoket.loket_name);
      }
    } catch (error) {
      console.error("Error fetching lokets:", error);
    }
  };

  useEffect(() => {
  fetchLokets();
  return () => {
    isMounted = false;
    socket.off('update_loket', handleLoketUpdate);
  };
}, [allowedLokets]);

const handleLoketUpdate = () => {
    if (isMounted) fetchLokets();
  };



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
    // for (const loket of lokets) {
    //       if (loket.loket_id !== loketId) {
    //         await LoketAPI.updateLoket(loket.loket_id, loket.loket_name, loket.description, "close");
    //       }
    //     }
  socket.on('update_loket', handleLoketUpdate);

    console.log(`? Loket ${loketName} diaktifkan.`);
  } catch (error) {
    console.error(`? Gagal memperbarui status loket:`, error);
  }
};

  
async function getInitalData(){
  let response;
  if(date){
    console.log("TEST DATE",date)
    response = await PickupAPI.getPickupByDate(location,date);
  }
  else{
    response = await PickupAPI.getPickupToday(location);
  }
  console.log("RESP",response);
    processQueue(response);
}
 const processQueue = async (response) => {
    if (!selectedStatus) return;

    try {
        // Calculate yesterday's date at midnight
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        let filteredQueues = response.data.map(item => {
            // Create normalized date for comparison
            const itemDate = new Date(item.waiting_pickup_medicine_stamp);
            itemDate.setHours(0, 0, 0, 0);
            
            return {
                ...item,
                isYesterday: itemDate.getTime() === yesterday.getTime()
            };
        });

        if (selectedStatus) {
            filteredQueues = filteredQueues.filter(item => item.status === selectedStatus);
        }

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

        filteredQueues = filteredQueues.sort(
            (a, b) => getEarliestTimestamp(a) - getEarliestTimestamp(b)
        );

        console.log("QUEUELIST with yesterday flag:", filteredQueues);
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
        console.error("Error processing queue:", error);
    }
};
useEffect(() => {
  

   getInitalData();
  socket.on('get_responses_pickup',(payload)=>{
    console.log("PROCESSUS",payload);
    processQueue(payload);
    console.log("QUEUELIST2",queueList);
  })

    return () => {
            socket.off('get_responses_pickup');
        };
}, [selectedStatus, selectedLoketLocal, date]); // Add date to dependencies

// Add a clear date function
const handleClearDate = () => {
  setDate(null);
};


useEffect(() => {
  const interval = setInterval(() => {
    if (new Date().toDateString() !== currentDate) {
      setCurrentDate(new Date().toDateString());
      window.location.reload();
    }
  }, 3600000);
  return () => clearInterval(interval);
}, [currentDate]);



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

 const handleSelectAll = () => {
  const allIds = queueList.map((item) => item.NOP);
  setSelectedQueueIds(allIds);
  setSelectedQueue2([...queueList]);
  
  // Set selectedQueue to the first item in the list (or last, or null)
  if (queueList.length > 0) {
    setSelectedQueue(queueList[0]); // First item
    // OR
    // setSelectedQueue(queueList[queueList.length - 1]); // Last item
  } else {
    setSelectedQueue(null);
  }
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
 
 const handleClosePhoneForm = () => {
    setPhoneVisible(false);
  };
  async function handleUpdatePhone(selectedQueue){
    try {
      console.log(selectedQueue);
      setPhoneVisible(true);
      setPhoneQueue(selectedQueue);
      
    } catch (error) {
            console.error("Error Updating tasks:", error);

    }
  }

const hasYesterdayItems = queueList.some(item => item.isYesterday);
  return (
    <Box sx={{ padding: "10px" }}>
       {phoneVisible &&
                                <PhoneEditForm location={location} visible={phoneVisible} onClose={handleClosePhoneForm} selectedQueue={phoneQueue}/>
                                }
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
  <Checkbox
    checked={selectedQueueIds.length > 0 && selectedQueueIds.length === queueList.length}
    indeterminate={selectedQueueIds.length > 0 && selectedQueueIds.length < queueList.length}
    onChange={() => {
      if (selectedQueueIds.length === queueList.length) {
        // If all are selected, deselect all
        setSelectedQueueIds([]);
        setSelectedQueue2([]);
      } else {
        // Otherwise select all
        handleSelectAll();
      }
    }}
  />
</TableCell>
              {hasYesterdayItems && (
      <TableCell align="center">
        <strong>Kemarin?</strong>
      </TableCell>
    )}
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
                <strong>No Telepon</strong>
              </TableCell>
              {/* <TableCell align="center">
                <strong>Status</strong>
              </TableCell> */}
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
           
          <TableCell  align="center">
            <Checkbox
              checked={selectedQueueIds.includes(item.NOP)}
              onChange={() => handleSelectQueue(item.NOP, item)}
            />
            
          </TableCell>
          {hasYesterdayItems && (
        <TableCell style={{ fontWeight: 'bold' }} align="center">
          {item.isYesterday ? (
            <span className="text-red-600 font-bold">KEMARIN</span>
          ) : null}
        </TableCell>
      )}
                <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>{item.queue_number}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>{item.NOP}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>{item.patient_name}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>{item.sep_no}</TableCell>
                <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>
                  {item.medical_record_no || "-"}
                </TableCell>
                <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>
      <div className="flex flex-row items-center h-full " style={{gap:"1px", minWidth:"120px"}}>
 <Button onClick={(e)=>handleUpdatePhone(item)} className="p-0 m-0">
            <EditIcon className="p-0 m-0"></EditIcon>

     </Button>

      <div className='font-bold'>
    {item.phone_number}

    </div>
      </div>
   
    </TableCell>  
                {/* <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>{item.status}</TableCell> */}
                <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>
                  {item.status_medicine === "Racikan"
                    ? "Racikan"
                    : item.status_medicine === "Non - Racikan" ? "Non - Racikan" : "Tidak Ada Resep"}
                </TableCell>
                 <TableCell style={{ fontWeight: 'bold' }} align="center" className='font-bold'>
                                                          {item.waiting_pickup_medicine_stamp 
                                                                               ? dayjs(item.waiting_pickup_medicine_stamp , "YYYY-MM-DD HH:mm:ss").format("DD MMM YYYY HH:mm")
                                                             
                                                                             : "-"}
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
