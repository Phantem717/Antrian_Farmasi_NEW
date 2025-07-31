"use client";

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper,TextField,Button,Input } from "@mui/material";
import MedicineAPI from "@/app/utils/api/Medicine";
import { getSocket } from "@/app/utils/api/socket";
import { Form } from "antd";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export default function DaftarAntrian({location, scanResult, setIsDeleted }) {
    dayjs.extend(customParseFormat);
    const dateFormat = "YYYY-MM-DD";
    const socket = getSocket();
    const [queueList, setQueueList] = useState([]);
    const [rawQueueList, setRawQueueList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [currentDate,setCurrentDate] = useState(new Date().getDate());
    const handleSearch = (searchText) => {
        setSearchText(searchText);
    };

    const changeDate = (date,datestring) => {
        console.log("DATE",date);
        setSelectedDate(datestring || dayjs());
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



    const handleSearchClear = () => {
        setSearchText('');
    };

    async function fetchInitialQueue() {
        let response;

        setLoading(true);
        try {
            if(selectedDate){
                                console.log("DATE",selectedDate);

                response = await MedicineAPI.getMedicineByDate(location,selectedDate);
            }
            else{
                response = await MedicineAPI.getMedicineToday(location);

            }
            console.log("RESP",response);
            processQueue(response);
        } catch (error) {
            console.error("Gagal mengambil data antrian:", error);
            setQueueList([]);
            setRawQueueList([]);
        } finally {
            setLoading(false);
        }
    }

    const processQueue = async (response) => {
        setLoading(true);
        try {
            if (response && Array.isArray(response.data)) {
                const formattedData = response.data.map((item) => ({
                        NOP: item.NOP,
                        patient_name: item.patient_name || "Tidak Diketahui",
                        queue_number: item.queue_number || '-',
                        medical_record_no: item.medical_record_no || "Tidak Diketahui",
                        status: item.status || "Menunggu",
                        medicine_type: item.medicine_type !== "Empty" ? item.medicine_type : "Belum Ditentukan",
                        timestamp: item.waiting_medicine_stamp
                    }))
                    .sort((a, b) => {
                        const getTimestamp = (item) => {
                            if (!item.timestamp) return Infinity;
                            return new Date(item.timestamp).getTime();
                        };
                        return getTimestamp(a) - getTimestamp(b);
                    });

                setRawQueueList(formattedData);
                applyFilters(formattedData, searchText);
            } else {
                setQueueList([]);
                setRawQueueList([]);
            }
        } catch (error) {
            console.error("Gagal mengambil data antrian:", error);
            setQueueList([]);
            setRawQueueList([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (data, searchText) => {
        if (!searchText) {
            setQueueList(data);
        } else {
            const filtered = data.filter(item =>
                item.patient_name?.toLowerCase().includes(searchText.toLowerCase())
            );
            setQueueList(filtered);
        }
    };

    useEffect(() => {
        fetchInitialQueue();
        socket.on('get_responses_proses', (payload) => {
            console.log("PAYLOAD", payload);
            processQueue(payload);
        });
        
        return () => {
            socket.off('get_responses_proses');
        };
    }, [socket, selectedDate]);

    useEffect(() => {
        if (!scanResult) return;

        const showAlertAndUpdate = async () => {
            const isExist = queueList.some((item) => item.NOP === scanResult);

            if (isExist) {
                setQueueList(prevList => prevList.filter(item => item.NOP !== scanResult));
                setRawQueueList(prevList => prevList.filter(item => item.NOP !== scanResult));
                setIsDeleted(true);
                
                await Swal.fire({
                    icon: "success",
                    title: "Antrian Dihapus",
                    text: `Booking ID ${scanResult} telah diproses.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Nomor Tidak Ditemukan",
                    text: `Booking ID ${scanResult} tidak ada dalam daftar.`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        };

        showAlertAndUpdate();
    }, [scanResult]);

    useEffect(() => {
        applyFilters(rawQueueList, searchText);
    }, [searchText, rawQueueList]);

    return (
        <Box sx={{ padding: "10px", overflow: "auto" }}>
            <Typography variant="h4" align="center" sx={{ marginBottom: "20px" }}>
                Daftar Antrian Farmasi (Waiting Medicine)
            </Typography>

            <Paper elevation={3} sx={{ padding: "10px" }}>
               <DatePicker 
                             size="large"
               
                           onChange={changeDate} 
                               maxDate={dayjs(new Date().toISOString(), dateFormat)}
                               defaultValue={dayjs(new Date().toISOString(), dateFormat)}
               
                           /> 
                
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
                                minWidth: 0,
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
                            flex: '0 0 auto'
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

                <Box sx={{ maxHeight: "600px", overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>NOP</strong></TableCell>
                                <TableCell align="center"><strong>Nomor Antrian</strong></TableCell>
                                <TableCell align="center"><strong>Nama Pasien</strong></TableCell>
                                <TableCell align="center"><strong>No. Rekam Medis</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Jenis Obat</strong></TableCell>
                                <TableCell align="center"><strong>Timestamp</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : queueList.length > 0 ? (
                                queueList.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{item.NOP}</TableCell>
                                        <TableCell align="center">{item.queue_number}</TableCell>
                                        <TableCell align="center">{item.patient_name}</TableCell>
                                        <TableCell align="center">{item.medical_record_no}</TableCell>
                                        <TableCell align="center">{item.status}</TableCell>
                                        <TableCell align="center">{item.medicine_type}</TableCell>
                                        <TableCell align="center">
                                            {item.timestamp ? new Date(item.timestamp).toLocaleString("id-ID", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            }) : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Tidak ada antrean waiting_medicine untuk tanggal {selectedDate}.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        </Box>
    );
}