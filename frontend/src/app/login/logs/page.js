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
            marginBottom:"25px"
          }}
        >
      <MedicineTypeCard />
      <BarChart />
      <AvgServiceTime />
                  <TableLogs  
         />
        </Content>

      </Layout>
        <Footer />

    </Layout>
  );
}
