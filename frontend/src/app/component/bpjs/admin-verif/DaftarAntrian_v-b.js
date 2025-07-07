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
  TextField
} from "@mui/material";
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
import DatePicker from '@/app/component/datepicker';
import PrintIcon from '@mui/icons-material/Print';
import PrintAntrian from "@/app/utils/api/printAntrian";

const DaftarAntrian = ({ selectedQueueIds, setSelectedQueueIds, onSelectQueue, setSelectedLoket,setSelectedQueue2,selectedQueue2 }) => {  
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
  const socket = getSocket();
    const [date,setDate]= useState("");
  
  // ? Loket yang diizinkan untuk admin verifikasi
  const allowedLokets = ["Loket 1", "Loket 2"];
  // ? Fetch Loket dari API
  useEffect(() => {
    const fetchLokets = async () => {
      try {
        const loketData = await LoketAPI.getAllLokets();
        const filteredLokets = loketData.data.filter((loket) => 
          allowedLokets.includes(loket.loket_name)
        );
        setLokets(filteredLokets);

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
useEffect(() => {
  if (!selectedLoketLocal && !selectedStatus) return;

  const fetchQueueList = async () => {
    try {
      const response = await VerificationAPI.getAllVerificationTasks();
      
      let filteredQueues = response.data.filter((item) => {
        if (!item || !item.status || item.waiting_verification_stamp === undefined) {
          return false;
        }
        
        const verificationStamp = typeof item.waiting_verification_stamp === 'string' 
          ? new Date(item.waiting_verification_stamp) 
          : item.waiting_verification_stamp;

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

      // Use EARLIEST timestamp like the pickup version
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

      // Sort by earliest timestamp (ascending) like pickup version
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

  fetchQueueList();
  
  const interval = setInterval(fetchQueueList, 10000);
  return () => clearInterval(interval);
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

console.log("DATe",date);
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
    patient_name: payload.patient_name || "-"
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
                    <CreateInstanceForm  visible={visible} 
        onClose={handleCloseBarcodeScanner} />
      
      }

      {phoneVisible &&
      <PhoneEditForm visible={phoneVisible} onClose={handleClosePhoneForm} selectedQueue={phoneQueue}/>
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
          <div className="w-[200px]">
            <DatePicker date={date} setDate={setDate} selectedStatus={selectedStatus}/>
          </div>
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
   <div className="w-full flex items-center gap-2 mb-2">
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleSearch(searchText);
    }}
    className="w-full flex items-center gap-2"
  >
    <TextField
      placeholder="Search patients"
      variant="outlined"
      size="small"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      sx={{ flexGrow: 1 }}
    />

    <Button
      type="button"
      variant="outlined"
      onClick={handleSearchClear}
      sx={{ whiteSpace: 'nowrap' }}
    >
      Clear
    </Button>
  </form>
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
              
  <TableRow key={item.NOP} hover>
    <TableCell align="center" className="flex flex-row justify-center items-center">
      <Checkbox checked={selectedQueueIds.includes(item.NOP)} onChange={() => handleSelectQueue(item.NOP)} />
        <Button onClick={()=>handlePrintFunction(item)}>      <PrintIcon className="flex items-middle" ></PrintIcon>
</Button>
    </TableCell>
   
    <TableCell align="center">{item.queue_number}</TableCell>
    <TableCell align="center">{item.NOP}</TableCell>
    <TableCell align="center">{item.patient_name}</TableCell>
    <TableCell align="center">{item.sep_no}</TableCell>
    <TableCell align="center">{item.medical_record_no || "-"}</TableCell>
    <TableCell align="center">
      {item.status.replace("_verification", "")}
    </TableCell>
    <TableCell align="center">
    {item.status_medicine === "Tidak ada Resep" ? "Tidak ada Resep" : item.status_medicine === "Racikan" ? "Racikan" : item.status_medicine}
    </TableCell>
     <TableCell align="center" className="flex flex-row items-center " style={{gap:"1px"}}>
     <Button onClick={(e)=>handleUpdatePhone(item)} className="p-0 m-0">
            <EditIcon className="p-0 m-0"></EditIcon>

     </Button>
    {item.phone_number}
    </TableCell>
     <TableCell align="center">
     {item.waiting_verification_stamp 
                ? new Date(item.waiting_verification_stamp).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                })
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
