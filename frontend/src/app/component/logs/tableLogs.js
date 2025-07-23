//src\components\admin\DisplayAntrian.js
import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";

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
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LogsAPI from "@/app/utils/api/Logs";
const tableLogs = ({
    selectedQueueIds,// ?? Mengirim daftar nomor yang dipilih
    setSelectedQueueIds, // ?? Agar bisa diperbarui dari DaftarAntrian
}) => {
   dayjs.extend(customParseFormat);
    const dateFormat="YYYY-MM-DD"
   const [queueList, setQueueList] = useState([]);
      const [lokets, setLokets] = useState([]);
      const [selectedFilter, setSelectedFilter] = useState("");
      const [selectedStatus, setSelectedStatus] = useState("");
      const [filteredData,setFilteredData]= useState([]);
     const [type, setType] = useState("");
const [date, setDate] = useState(null);
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
    const fetchInitialData = async () => {
      try {
        const response = await LogsAPI.getAllLogsToday();
        console.log("TABLELOGS",response.data);

        setQueueList(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError(err.message || "Failed to load data");
        message.error("Failed to load logs data");
      } finally {
      }
    };

    fetchInitialData();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        let data = [...queueList];

        // Apply period filter if selected
        if (selectedFilter) {
          const response = await LogsAPI.getByPeriod(selectedFilter);
                    console.log("SELECTED",selectedFilter,response);

          data = response.data;
        }

        // Apply date filter if selected
        if (date) {
          const response = await LogsAPI.getLogsByDate(date);
          console.log("SELECTED DATE",date,response);

          data = response.data;
        }

        // Apply type filter
        if (type === 'racikan') {
          data = data.filter(item => item.status_medicine === 'Racikan');
        } else if (type === 'nonracikan') {
          data = data.filter(item => item.status_medicine === 'Non - Racikan');
        }

        setFilteredData(data);
      } catch (err) {
        setError(err.message || "Failed to apply filters");
        message.error("Failed to apply filters");
      } finally {
      }
    };

    applyFilters();
  }, [type, selectedFilter, date, queueList]);


const changeDate = (date,dateString) => {
  console.log("date",date,dateString);
  setDate(dateString);
}

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
 <DatePicker 
            size="large"
         
            onChange={changeDate} 
                maxDate={dayjs(new Date().toISOString(), dateFormat)}

            />  </div>
 
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
          {filteredData &&
          filteredData.map((item, index) => (
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
