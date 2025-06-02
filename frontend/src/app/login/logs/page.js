"use client";

import React, { useEffect, useState,useCallback } from "react";
import { Layout } from "antd";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DisplayAntrian from "@/app/component/bpjs/admin-obat/DisplayAntrian-b";
import PilihAksi from "@/app/component/bpjs/admin-obat/PilihTombol-b";
import DaftarAntrian from "@/app/component/bpjs/admin-obat/DaftarAntrian-b";
import MovingText from "@/app/component/bpjs/admin-obat/Movingtext";
import Sidebar from "@/app/component/Sidebar-b";
import LogsAPI from "../../utils/api/Logs";
import TableLogs from '@/app/component/logs/tableLogs'
import BarChart from '@/app/component/logs/barDataPerHour'
const { Content } = Layout;
import { useRouter, usePathname } from "next/navigation";
import MedicineTypeCard from '@/app/component/logs/medicineTypeCard'
import AvgServiceTime from "@/app/component/logs/avgServiceTime";

export default function Logs() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const [selectedLoket, setSelectedLoket] = useState("");
  const [selectedQueue, setSelectedQueue] = useState(null); 
  const [selectedQueueIds, setSelectedQueueIds] = useState([]); 
  const [medicineType, setMedicineType] = useState([]);
  const [dataPerHour,setDataPerHour] = useState([]);
  const [avgTime,setAvgTime]= useState([]);
  function useTokenCheck() {
    const [token, setToken] = useState("");
  
    useEffect(() => {
      if (typeof window !== 'undefined') {
        setToken(localStorage.getItem('token'));
      }
    }, []);
  
    const checkTokenExpired = useCallback(() => {
      if (!token) return true;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Math.floor(Date.now() / 1000);
      } catch (error) {
        console.error('Token error:', error);
        return true;
      }
    }, [token]);
  
    return { token, isExpired: checkTokenExpired() };
  }
  const fetchQueueList = async () => {
    try {
      const response = await LogsAPI.getAllLogs();
      
      let [allLogs,medicineType,dataPerHour,avgTime] = await Promise.all([
        LogsAPI.getAllLogs(),
        LogsAPI.getMedicineType(),
      LogsAPI.getDataPerHour(),
    LogsAPI.getAvgServiceTime()]
      );
      const payload ={
       racikan : {
        time: avgTime.data[0]['AVG PROCESSING TIME - RACIKAN (MINUTES)'],
        type: 'Racikan'
       },
       nonracikan : {
 time: avgTime.data[0]['AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'],
        type: 'Non - Racikan'
       }
      }
      // ? Filter berdasarkan status
      console.log("?? Data antrian dari API:", allLogs,"DATA MEDIDICNE:",medicineType, "DATA PER HOUR",dataPerHour, "SERVICE TIME",payload);

      // console.log("?? Data antrian setelah diurutkan:", response.data);
      setSelectedQueueIds(allLogs.data);
      setMedicineType(medicineType.data);
      setDataPerHour(
        dataPerHour.data.map(item => ({
          ...item,
          hour_of_day: item.hour_of_day.toString(), // convert to string
        }))
      );   
      setAvgTime(payload); 
        // setQueueList(filteredQueues);
    } catch (error) {
      console.error("? Error fetching queue list:", error);
    }
  };


  const checkResponse = useTokenCheck();
  const router = useRouter();

  useEffect(() => {
    if(!checkResponse){
      router.push("/login"); // Arahkan ke halaman login
    }
    else{
      fetchQueueList();

    }
  },[useTokenCheck,router])

  return (
    <Layout style={{ minheight: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout
        style={{
          marginLeft: siderWidth,
          transition: "margin-left 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <MovingText />

        <Content
          style={{
            flex: 1,
            padding: "24px",
            background: "#fff",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
      <MedicineTypeCard medicineType={medicineType} />
      <BarChart dataPerHour={dataPerHour}/>
      <AvgServiceTime avgTime={avgTime}/>
          
                  <TableLogs  
        selectedQueueIds = {selectedQueueIds}// ?? Mengirim daftar nomor yang dipilih
        setSelectedQueueIds= {setSelectedQueueIds}  />
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
}
