//src\components\admin\DisplayAntrian.js
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
const tableLogs = ({
    selectedQueueIds,// ?? Mengirim daftar nomor yang dipilih
    setSelectedQueueIds, // ?? Agar bisa diperbarui dari DaftarAntrian
}) => {
    useEffect(() => {
        setFilteredData(selectedQueueIds);
      }, [selectedQueueIds]);
      
    const [queueList, setQueueList] = useState([]);
      const [lokets, setLokets] = useState([]);
      const [selectedFilter, setSelectedFilter] = useState("");
      const [selectedStatus, setSelectedStatus] = useState("");
      const [filteredData,setFilteredData]= useState([]);
      const handleFilterChange = (value) => {
        setSelectedFilter(value);
      
        const today = new Date();
        let startDate;
      
        switch (value) {
          case "hari_ini":
            startDate = new Date(today);
            startDate.setHours(0, 0, 0, 0);
            break;
          case "minggu_ini":
            startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay()); // Sunday (start of the week)
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
            startDate = new Date(today.getFullYear(), 0, 1); // Jan 1st this year
            break;
          default:
            setFilteredData(selectedQueueIds);
            return;
        }
      
        const filtered = selectedQueueIds.filter((queue) => {
          if (!queue.completed_pickup_medicine_stamp) return false;
      
          const completedDate = new Date(queue.completed_pickup_medicine_stamp);
          return completedDate >= startDate;
        });
      
        setFilteredData(filtered);
      };
      
  return (
    <Box sx={{ padding: "10px" }}>
    <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
      Table Logs
    </Typography>

    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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

    </Box>

    <Paper elevation={3} sx={{ padding: "10px", maxHeight: "700px", overflow: "auto" }}>
    <Box sx={{ minWidth: "1500px" }}>

      <Table stickyHeader >
        <TableHead>
          <TableRow>
    
            <TableCell align="center"><strong>ID Booking</strong></TableCell>
            <TableCell align="center"><strong>Nama Pasien</strong></TableCell>
            {/* <TableCell align="center"><strong>Nomor SEP</strong></TableCell> */}
            <TableCell align="center"><strong>No. Rekam Medis</strong></TableCell>
            <TableCell align="center"><strong>Status Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Waiting Verification</strong></TableCell> 
            <TableCell align="center"><strong>Called Verification</strong></TableCell> 
            <TableCell align="center"><strong>Pending Verification</strong></TableCell> 
            <TableCell align="center"><strong>Recalled Verification</strong></TableCell> 

            <TableCell align="center"><strong>Processed Verification</strong></TableCell> 
            <TableCell align="center"><strong>Completed Verification</strong></TableCell> 
            <TableCell align="center"><strong>Waiting Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Completed Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Waiting Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Called Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Pending Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Recalled Pickup Medicine</strong></TableCell> 
            <TableCell align="center"><strong>Completed Pickup Medicine</strong></TableCell> 

          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={item.booking_id} hover>
            
             
              <TableCell align="center">{item.booking_id}</TableCell>
              <TableCell align="center">{item.patient_name}</TableCell>
              {/* <TableCell align="center">{item.sep_no}</TableCell> */}
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
                {item.called_verification_stamp 
                    ? new Date(item.called_verification_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.pending_verification_stamp 
                    ? new Date(item.pending_verification_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.recalled_verification_stamp 
                    ? new Date(item.recalled_verification_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.processed_verification_stamp 
                    ? new Date(item.processed_verification_stamp).toLocaleString("id-ID", {
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
                {item.pending_pickup_medicine_stamp 
                    ? new Date(item.pending_pickup_medicine_stamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })
                : "-"}
            </TableCell>
            <TableCell align="center">
                {item.recalled_pickup_medicine_stamp 
                    ? new Date(item.recalled_pickup_medicine_stamp).toLocaleString("id-ID", {
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
