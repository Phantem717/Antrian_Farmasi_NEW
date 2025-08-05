//src\app\component\admin-verif\DaftarAntrian_v.js
"use client";

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
  TextField,
} from "@mui/material";
import { Form } from "antd";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { DatePicker } from "antd";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import CreateInstanceForm from "@/app/component/bpjs/admin-verif/createInstanceForm";
import VerificationAPI from "@/app/utils/api/Verification";
import LoketAPI from "@/app/utils/api/Loket";
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import {getSocket} from "@/app/utils/api/socket";
import $ from 'jquery';
import PhoneEditForm from "@/app/component/bpjs/admin-verif/phoneEditForm";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import PrintIcon from '@mui/icons-material/Print';
import PrintAntrian from "@/app/utils/api/printAntrian";
  const allowedLokets = ["Loket 2", "Loket 3"];

const DaftarAntrian = ({location, selectedQueueIds, setSelectedQueueIds, onSelectQueue, setSelectedLoket,setSelectedQueue2,selectedQueue2 }) => {  
  dayjs.extend(customParseFormat);
  const dateFormat="YYYY-MM-DD"
  const [queueList, setQueueList] = useState([]);
  const [rawQueueList,setRawQueueList]= useState([]);
      const [searchText, setSearchText] = useState('');
  const [visible,setVisible]=useState(false);
  const [phoneVisible,setPhoneVisible] = useState(false);
  const [lokets, setLokets] = useState([]);
  const [selectedLoketLocal, setSelectedLoketLocal] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [phoneQueue, setPhoneQueue] =useState(null);
  const [currentDate,setCurrentDate]= useState(new Date().getDate());
  const socket = getSocket();
    const [date,setDate]= useState("");
  
  // ? Loket yang diizinkan untuk admin verifikasi
  const allowedLokets = ["Loket 2", "Loket 3"];
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
  const interval = setInterval(() => {
    if (new Date().toDateString() !== currentDate) {
      setCurrentDate(new Date().toDateString());
      window.location.reload();
    }
  }, 3600000);
  return () => clearInterval(interval);
}, [currentDate]);



const handleLoketUpdate = () => {
    if (isMounted) fetchLokets();
  };
  
  const fetchQueueList = async () => {
  try {
    let response;
    if (date) {
      response = await VerificationAPI.getVerificationTasksByDate(location,new Date(date).toISOString().split('T')[0]);
      console.log("DATE")
    } else {
      response = await VerificationAPI.getVerificationTasksToday(location);
      console.log("TODAY");

    }

    console.log("RESPONSE", response);
    let filteredQueues = response.data;

    // Add status filtering here
    if (selectedStatus) {
      filteredQueues = filteredQueues.filter(item => item.status === selectedStatus);
    }

    // Rest of your sorting logic remains the same
    const getEarliestTimestamp = (item) => {
      const timestamps = [
        item.waiting_verification_stamp,
        item.called_verification_stamp,
        item.recalled_verification_stamp,
        item.pending_verification_stamp,
        item.processed_verification_stamp,
      ]
        .filter(Boolean)
        .map((ts) => new Date(ts).getTime());

      return timestamps.length > 0 ? Math.min(...timestamps) : Infinity;
    };

    filteredQueues = filteredQueues.sort(
      (a, b) => getEarliestTimestamp(a) - getEarliestTimestamp(b)
    );

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
  if ( !selectedStatus) return;
  
  const fetchData = async () => {
    try {
      await fetchQueueList();
    } catch (error) {
      console.error('Error in fetchQueueList:', error);
    }
  };

  // fetchData();
  socket.on('update_daftar_verif',fetchData);

    return () => {
            socket.off('update_daftar_verif', fetchData);
        };


}, [selectedStatus, selectedLoketLocal, date]);

const handleLoketChange = async (loketName) => {
  setSelectedLoket(loketName);
  setSelectedLoketLocal(loketName);

  // ? Cari ID Loket yang Dipilih
  const selectedLoketData = lokets.find((loket) => loket.loket_name === loketName);
  if (!selectedLoketData) {
    console.error("? Loket tidak ditemukan!");
    return;
  }

  const loketId = selectedLoketData.loket_id;

  try {
    // ? Update status loket yang dipilih menjadi "active"
    await LoketAPI.updateLoket(loketId, loketName, selectedLoketData.description, "active");

    // ? Update status loket lainnya menjadi "close"
    for (const loket of lokets) {
      if (loket.loket_id !== loketId) {
        await LoketAPI.updateLoket(loket.loket_id, loket.loket_name, loket.description, "close");
      }
    }
  socket.on('update_loket', handleLoketUpdate);

    console.log(`? Loket ${loketName} diaktifkan, lainnya ditutup.`);
  } catch (error) {
    console.error(`? Gagal memperbarui status loket:`, error);
  }
};

  // ? Fungsi memilih / membatalkan pilihan nomor antrian
  const handleSelectQueue = (queueId) => {
    const selected = queueList.find((item) => item.NOP === queueId);
    console.log("SELECTED", selected);
    onSelectQueue(selected || null);
  
    // Update selectedQueueIds
    setSelectedQueueIds((prevSelectedIds) => {
      const updatedIds = prevSelectedIds.includes(queueId)
        ? prevSelectedIds.filter((id) => id !== queueId)
        : [...prevSelectedIds, queueId];
  
      // After updating selectedQueueIds, update selectedQueue2 based on it
      const updatedObjects = queueList.filter((item) =>
        updatedIds.includes(item.NOP)
      );
      setSelectedQueue2(updatedObjects);
  
      return updatedIds;
    });
    
    socket.emit('send_queues',selectedQueue2);
    console.log("SQ2", selectedQueue2, selectedQueueIds);
  };
  
  useEffect(() => {
  fetchLokets();
    socket.on('insert_appointment',fetchQueueList)

  return () => {
    isMounted = false;
    socket.off('update_loket', handleLoketUpdate);
        socket.off('insert_appointment',fetchQueueList)

  };
}, [allowedLokets]);

  async function deleteAction() {
    if (!selectedQueue2 || !selectedQueueIds || selectedQueueIds.length === 0) {
      console.log("Queues Needed");
      return;
    }
  
    try {
      for
       (const NOP of selectedQueueIds) {
      
        await DoctorAppointmentAPI.deleteAppointment(NOP);
        await VerificationAPI.deleteVerificationTask(NOP);
        await PharmacyAPI.deletePharmacyTask(NOP);
      }
  
      // Clear selection after successful deletion
       Swal.fire({
                   icon: "success",
                   title: `Antrian Berhasil Dihapus`,
                   toast: true,
                   position: "top-end",
                   showConfirmButton: false,
                   timer: 2000,
                   timerProgressBar: true,
                 });

      
      setSelectedQueueIds([]);
      socket.emit('update_verif');
      socket.emit('update_display');
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  }


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

 const handleCloseBarcodeScanner = () => {
    setVisible(false);
  };

  
 const handleClosePhoneForm = () => {
    setPhoneVisible(false);
  };
// Add a clear date function
const handleClearDate = () => {
  setDate(null);
};

const changeDate = (date,dateString) => {
  console.log("date",date,dateString);
  setDate(dateString);
}

  async function handleUpdatePhone(selectedQueue){
    try {
      console.log(selectedQueue);
      setPhoneVisible(true);
      setPhoneQueue(selectedQueue);
      
    } catch (error) {
            console.error("Error Updating tasks:", error);

    }
  }

  async function handlePrintFunction(payload){
    try {
       if(!payload){
   Swal.fire({
          icon: "error",
          title: "Print Gagal",
          text: "Data Kurang atau tidak sesuai",
          timer: 2000,
          showConfirmButton: false,
        });
  }

  const printPayload = {
    phone_number: payload.phone_number || "-",
    barcode: payload.NOP || "-",
    medicine_type: payload.status_medicine || "-",
    SEP: payload.sep_no || "-",
    tanggal_lahir: payload.patient_date_of_birth || null,
    queue_number : payload.queue_number || "-",
    patient_name: payload.patient_name || "-",
    lokasi: location
  }

  console.log("PRINT PAYLOAD",payload);

  const print = await PrintAntrian.printAntrian(printPayload);
  const printResp = print.dataPrint;
  if(printResp.success){
        Swal.fire({
          icon: "success",
          title: "Print Berhasil",
          text: "Antrian Berhasil Di Print",
          timer: 2000,
          showConfirmButton: false,
        });
  }
  else{
Swal.fire({
                    icon: "error",
                    title: "Gagal Print!",
                    text: `${printResp.message}`,
                    timer: 2000,
                    showConfirmButton: false,
                })
  }
  console.log("PRINT",print);
    


    } catch (error) {
            console.error("Error deleting tasks:", error);
  Swal.fire({
                    icon: "error",
                    title: "Gagal Print!",
                    text: `${error.response.data.message}`,
                    timer: 2000,
                    showConfirmButton: false,
                })
    }
 

  }
  return (
    <Box sx={{ padding: "10px" }}>
      {visible &&
                    <CreateInstanceForm location={location}  visible={visible} 
        onClose={handleCloseBarcodeScanner} />
      
      }

      {phoneVisible &&
      <PhoneEditForm location={location} visible={phoneVisible} onClose={handleClosePhoneForm} selectedQueue={phoneQueue}/>
      }

      <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
        Daftar Antrian
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <Select
      value={selectedLoketLocal}
      onChange={(e) => handleLoketChange(e.target.value)}
      displayEmpty
      sx={{ width: "200px", marginRight: "10px" }}
    >
      <MenuItem value="" disabled>Pilih Loket</MenuItem>
      {lokets.map((loket) => (
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
          <MenuItem value="waiting_verification">Menunggu Verifikasi</MenuItem>
          <MenuItem value="called_verification">Panggil Verifikasi</MenuItem>
          <MenuItem value="recalled_verification">Panggil Ulang Verifikasi</MenuItem>
          <MenuItem value="pending_verification">Tunda Verifikasi</MenuItem>
          <MenuItem value="processed_verification">Proses Verifikasi</MenuItem>
        </Select>

        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", zIndex:"100"}}  >
            <DatePicker 
            size="large"
         
            onChange={changeDate} 
            disabled={!selectedStatus}
                maxDate={dayjs(new Date().toISOString(), dateFormat)}
                defaultValue={dayjs(new Date().toISOString(), dateFormat)}

            />
            {/* <DatePicker2 date={date} setDate={setDate} selectedStatus={selectedStatus}/> */}
          
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ fontSize: "0.9rem", padding: "10px 15px" }} disabled={!selectedQueueIds.length} onClick={()=>deleteAction()}>
            Hapus Antrian
          </Button>
          <Button variant="contained" color="success" startIcon={<AddIcon />} sx={{ fontSize: "0.9rem", padding: "10px 15px" }} onClick={()=>setVisible(true)}>
            Tambah Antrian
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ padding: "10px", maxHeight: "600px", overflow: "auto" }}>
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
        
    <Table stickyHeader className="z-0 overflow-hidden"  >

          <TableHead>
            <TableRow>
              <TableCell align="center"><strong>Pilih</strong></TableCell>
      
              <TableCell align="center"><strong>No. Antrian</strong></TableCell>
              <TableCell align="center"><strong>ID Booking</strong></TableCell>
              <TableCell align="center"><strong>Nama Pasien</strong></TableCell>
              <TableCell align="center"><strong>Nomor SEP</strong></TableCell>
              <TableCell align="center"><strong>Nama Dokter</strong></TableCell>
              <TableCell align="center"><strong>No. Rekam Medis</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Status Medicine</strong></TableCell> 
              <TableCell align="center"><strong>Phone Number</strong></TableCell>
               <TableCell align="center">
                               Timestamp
                              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queueList && 
             queueList.map((item, index) =>{
              // console.log("VERIFKEY",item.booking_id);
return (
              
  <TableRow  key={item.NOP} hover>
    <TableCell align="center" className="flex flex-row justify-center items-center">
      <Checkbox checked={selectedQueueIds.includes(item.NOP)} onChange={() => handleSelectQueue(item.NOP)} />
        <Button onClick={()=>handlePrintFunction(item)}>      <PrintIcon className="flex items-middle" ></PrintIcon>
</Button>
    </TableCell>
   
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>{item.queue_number}</TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>{item.NOP}</TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>{item.patient_name}</TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>{item.sep_no}</TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>{item.doctor_name}</TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>{item.medical_record_no || "-"}</TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>
      {item.status.replace("_verification", "")}
    </TableCell>
    <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>
    {item.status_medicine === "Tidak ada Resep" ? "Tidak ada Resep" : item.status_medicine === "Racikan" ? "Racikan" : item.status_medicine}
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
     <TableCell align="center" style={{ fontWeight: 'bold' }} className='font-bold'>
     {item.waiting_verification_stamp 
                      ? dayjs(item.waiting_verification_stamp , "YYYY-MM-DD HH:mm:ss").format("DD MMM YYYY HH:mm")
    
                    : "-"}
                    </TableCell>
  </TableRow>
)
            } )}
            
           
          </TableBody>
        </Table>
)}

</Paper>

    </Box>
  );
};

export default DaftarAntrian;
