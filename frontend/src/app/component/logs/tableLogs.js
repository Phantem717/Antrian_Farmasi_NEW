//src\components\admin\DisplayAntrian.js
import React, { useState, useEffect } from "react";
import DatePicker from "@/app/component/datepicker";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
import { ConstructionOutlined } from "@mui/icons-material";
const tableLogs = ({
    selectedQueueIds,// ?? Mengirim daftar nomor yang dipilih
    setSelectedQueueIds, // ?? Agar bisa diperbarui dari DaftarAntrian
}) => {
   const [queueList, setQueueList] = useState([]);
      const [lokets, setLokets] = useState([]);
      const [selectedFilter, setSelectedFilter] = useState("");
      const [selectedStatus, setSelectedStatus] = useState("");
      const [filteredData,setFilteredData]= useState([]);
     const [type, setType] = useState("");
const [date, setDate] = useState(new Date());
console.log("TABLELOGS",selectedQueueIds);
const ExportToExcel = ({ data, fileName }) => {
   const exportData = filteredData.map(item => ({
    NOP: item.NOP,
    'Nomor Antrian': item.queue_number,
    'Nama Pasien': item.patient_name,
    'No. Rekam Medis': item.medical_record_no || "-",
    'Status Medicine': item.status_medicine || "-",
    'Waiting Verification': item.waiting_verification_stamp 
      ? new Date(item.waiting_verification_stamp).toLocaleString("id-ID")
      : "-",
    'Completed Verification': item.completed_verification_stamp 
      ? new Date(item.completed_verification_stamp).toLocaleString("id-ID")
      : "-",
    'Waiting Medicine': item.waiting_medicine_stamp 
      ? new Date(item.waiting_medicine_stamp).toLocaleString("id-ID")
      : "-",
    'Completed Medicine': item.completed_medicine_stamp 
      ? new Date(item.completed_medicine_stamp).toLocaleString("id-ID")
      : "-",
    'Waiting Pickup Medicine': item.waiting_pickup_medicine_stamp 
      ? new Date(item.waiting_pickup_medicine_stamp).toLocaleString("id-ID")
      : "-",
    'Called Pickup Medicine': item.called_pickup_medicine_stamp 
      ? new Date(item.called_pickup_medicine_stamp).toLocaleString("id-ID")
      : "-",
    'Completed Pickup Medicine': item.completed_pickup_medicine_stamp 
      ? new Date(item.completed_pickup_medicine_stamp).toLocaleString("id-ID")
      : "-",
    'Duration (Menit)': item.verification_to_pickup_minutes || "-"
  }));

  // Create worksheet and workbook
  const ws = XLSX.utils.json_to_sheet(exportData);
  ws['!rows'] = [{ hpx: 500 }]; 
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data Antrian");

  // Generate Excel file
  XLSX.writeFile(wb, `Data_Antrian_${new Date().toISOString().split('T')[0]}.xlsx`);
}

     useEffect(() => {
  let filtered = [...selectedQueueIds];

  // Filter by type
  if (type === 'racikan') {
    filtered = filtered.filter(item => item.status_medicine === 'Racikan');
  } else if (type === 'nonracikan') {
    filtered = filtered.filter(item => item.status_medicine === 'Non - Racikan');
  }

  // Filter by fixed range (hari_ini, minggu_ini, etc.)
  if (selectedFilter) {
    const today = new Date();
    let startDate;

    switch (selectedFilter) {
      case "hari_ini":
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "minggu_ini":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "bulan_ini":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "3_bulan":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        break;
      case "6_bulan":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 6);
        break;
      case "tahun_ini":
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
    }

    if (startDate) {
      filtered = filtered.filter(item => {
        // if (!item.completed_pickup_medicine_stamp) return false;
        const completedDate = new Date(item.waiting_verification_stamp);
        return completedDate >= startDate;
      });
    }
  }

  // Filter by exact date picker
  if (date) {
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    filtered = filtered.filter(item => {
      const completedDate = new Date(item.waiting_verification_stamp);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.toDateString() === selectedDay.toDateString();
    });
  }

  setFilteredData(filtered);
  console.log("FILTER",filteredData);
}, [selectedQueueIds, type, selectedFilter, date]);


const handleFilterType = (value) => {
  setType(value); // No filtering logic here
};

const handleFilterChange = (value) => {
  setSelectedFilter(value); // No filtering logic here
};
      const handleClearDate = () => {
  setDate(null);
};
  return (
    <Box sx={{ padding: "10px" }}>
    <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
      Table Logs
    </Typography>

    <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
    <Select
  value={selectedFilter}
  onChange={(e) => handleFilterChange(e.target.value)}
  displayEmpty
  renderValue={(selected) => {
    if (!selected) {
      return <em>Pilih Opsi</em>;
    }
    // Optionally make this prettier if needed
    const labelMap = {
      hari_ini: "Hari Ini",
      minggu_ini: "Minggu Ini",
      bulan_ini: "Bulan Ini",
      "3_bulan": "3 Bulan Lalu",
      "6_bulan": "6 Bulan Lalu",
      tahun_ini: "Tahun Ini",
    };
    return labelMap[selected] || selected;
  }}
  sx={{ width: "200px", marginRight: "10px" }}
>
  <MenuItem value=""><em>Pilih Opsi</em></MenuItem>
  <MenuItem value="hari_ini">Hari Ini</MenuItem>
  <MenuItem value="minggu_ini">Minggu Ini</MenuItem>
  <MenuItem value="bulan_ini">Bulan Ini</MenuItem>
  <MenuItem value="3_bulan">3 Bulan Lalu</MenuItem>
  <MenuItem value="6_bulan">6 Bulan Lalu</MenuItem>
  <MenuItem value="tahun_ini">Tahun Ini</MenuItem>
</Select>

<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <div className="w-[200px] z-10">
    <DatePicker date={date} setDate={setDate} selectedStatus={"LOGS"} />
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

<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <div className="w-[200px]">
  <Select
  value={type}
  onChange={(e) => handleFilterType(e.target.value)}
  displayEmpty
  renderValue={(selected) => {
    if (!selected) {
      return <em>Pilih Opsi</em>;
    }
    // Optionally make this prettier if needed
     const labelMap = {
      racikan: "Racikan",
      nonracikan: "Non - Racikan",
      
    };
    return labelMap[selected] || selected;
  }}
  sx={{ width: "200px", marginRight: "10px" }}
>

  <MenuItem value=""><em>Pilih Opsi</em></MenuItem>
  <MenuItem value="racikan">Racikan</MenuItem>
  <MenuItem value="nonracikan">Non - Racikan</MenuItem>
  
</Select>
  </div>
 
</Box>
  {/* Add Export Button Here */}
  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
    <Button 
      variant="contained" 
      color="primary" 
      onClick={ExportToExcel}
      sx={{ 
        backgroundColor: '#4CAF50',
        '&:hover': { backgroundColor: '#388E3C' }
      }}
    >
      Export to Excel
    </Button>
  </Box>
    </Box>

    <Paper elevation={3} sx={{ padding: "10px", maxHeight: "700px", overflow: "auto" }}>
    <Box sx={{ minWidth: "1500px" }}>

      <Table stickyHeader className="z-0" >
        <TableHead>
          <TableRow className="z-0">
    
            <TableCell align="center"><strong>NOP</strong></TableCell>  
                        <TableCell align="center"><strong>Nomor Antrian</strong></TableCell>  

            <TableCell align="center"><strong>Nama Pasien</strong></TableCell>
            <TableCell align="center"><strong>No. Rekam Medis</strong></TableCell>
            <TableCell align="center"><strong>Status Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Waiting Verification</strong></TableCell> 
   

            <TableCell align="center"><strong>Completed Verification</strong></TableCell> 
            <TableCell align="center"><strong>Waiting Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Completed Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Waiting Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Called Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Completed Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Duration</strong></TableCell> 

          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.NOP} hover>
            
             
              <TableCell align="center">{item.NOP}</TableCell>
                            <TableCell align="center">{item.queue_number}</TableCell>

              <TableCell align="center">{item.patient_name}</TableCell>
              <TableCell align="center">{item.medical_record_no || "-"}</TableCell>
              <TableCell align="center">{item.status_medicine || "-"}</TableCell>
              <TableCell align="center">
                {item.waiting_verification_stamp 
                    ? new Date(item.waiting_verification_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
       
            <TableCell align="center">
                {item.completed_verification_stamp 
                    ? new Date(item.completed_verification_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.waiting_medicine_stamp 
                    ? new Date(item.waiting_medicine_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.completed_medicine_stamp 
                    ? new Date(item.completed_medicine_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.waiting_pickup_medicine_stamp 
                    ? new Date(item.waiting_pickup_medicine_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.called_pickup_medicine_stamp 
                    ? new Date(item.called_pickup_medicine_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
      
        
            <TableCell align="center">
                {item.completed_pickup_medicine_stamp 
                    ? new Date(item.completed_pickup_medicine_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
             <TableCell align="center">
              <div className="d-flex flex-row gap-2">
                <div>
                {item.verification_to_pickup_minutes} 

                </div>
                <div>
                                  Menit

                  </div>
              </div>
                
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Box>
    </Paper>
  </Box>
  );
};

export default tableLogs;
