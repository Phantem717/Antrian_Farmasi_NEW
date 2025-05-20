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
const { Content } = Layout;
import { useRouter, usePathname } from "next/navigation";

export default function Logs() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const [selectedLoket, setSelectedLoket] = useState("");
  const [selectedQueue, setSelectedQueue] = useState(null); 
  const [selectedQueueIds, setSelectedQueueIds] = useState([]); 
  const router = useRouter;
  const token = localStorage.getItem("token");
   const checkTokenExpired = useCallback(() => {
         if (!token) return true;
         try {
           const payload = JSON.parse(atob(token.split(".")[1]));
           const currentTime = Math.floor(Date.now() / 1000);
           return payload.exp < currentTime;
         } catch (error) {
           console.error("Token parsing error:", error);
           return true;
         }
       }, [token]);
   
  
  const fetchQueueList = async () => {
    try {
      const response = await LogsAPI.getAllLogs();
      console.log("?? Data antrian dari API:", response.data);

      // ? Filter berdasarkan status
      
      console.log("?? Data antrian setelah diurutkan:", response.data);
      setSelectedQueueIds(response.data);
      // setQueueList(filteredQueues);
    } catch (error) {
      console.error("? Error fetching queue list:", error);
    }
  };

  useEffect(() => {
    if(    checkTokenExpired() == true){
      router.push("/login"); // Arahkan ke halaman login
    }
    else{
      fetchQueueList();

    }
  },[checkTokenExpired,router])

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
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
        <TableLogs  
        selectedQueueIds = {selectedQueueIds}// ?? Mengirim daftar nomor yang dipilih
        setSelectedQueueIds= {setSelectedQueueIds}  />
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
}
