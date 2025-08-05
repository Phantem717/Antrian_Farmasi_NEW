"use client";

import React, { useState,useEffect,useCallback } from "react";
import { Layout } from "antd";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DisplayAntrian from "@/app/component/bpjs/admin-verif/DisplayAntrian_v-b";
import PilihAksi from "@/app/component/bpjs/admin-verif/PilihTombol_v-b";
import DaftarAntrian from "@/app/component/bpjs/admin-verif/DaftarAntrian_v-b";
import MovingText from "@/app/component/bpjs/admin-verif/Movingtext_v";
import Sidebar from "@/app/component/Sidebar-b";
import CreateInstanceForm from "@/app/component/bpjs/admin-verif/createInstanceForm";
const { Content } = Layout;
import {getSocket} from "@/app/utils/api/socket";
import { useRouter, usePathname } from "next/navigation";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { use } from "react";
function useTokenCheck() {
  const [token, setToken] = useState(null);
  const [isExpired, setIsExpired] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setToken(token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsExpired(payload.exp < Math.floor(Date.now() / 1000));
      } catch (error) {
        console.error('Token error:', error);
        setIsExpired(true);
      }
    } else {
      setIsExpired(true);
    }
  }, []);

  return { token, isExpired };
}
export default function Admin({params}) {
  const {category} = use(params);
      const [isLoading, setIsLoading] = useState(false);
  const checkResponse = useTokenCheck();
  const router = useRouter();

  useEffect(() => {
    if (checkResponse.token !== null) { // Only check after we've tried to load the token
      setIsLoading(false);
      if (checkResponse.isExpired) {
        router.push("/login");
      }
    }
  }, [checkResponse, router]);

  if(isLoading){
    return    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  }
 

  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
    const [selectedLoket, setSelectedLoket] = useState("");
  
  const [selectedQueue, setSelectedQueue] = useState(null); // ?? Untuk menyimpan nomor antrian terakhir yang dipilih
  const [selectedQueueIds, setSelectedQueueIds] = useState([]); // ?? Untuk menyimpan banyak nomor antrian yang dipilih
  const [selectedQueue2, setSelectedQueue2] =useState([]);
  // ? Fungsi untuk menangani pemilihan antrian dari DaftarAntrian
  const onSelectQueue = (queue) => {
    console.log("?? Selected Queue:", queue);
    setSelectedQueue(queue);
    setSelectedQueue2([queue]); // ? Make sure it’s always an array
  };
  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar  lokasi={category} collapsed={collapsed} setCollapsed={setCollapsed} />

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
            background: "#EDEDED",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", gap: "14px", flex: 1 }}>
            {/* Bagian Kiri - Display Antrian & Pilih Aksi */}
            <div
              style={{
                flex: "1",
                minWidth: "300px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              
              <DisplayAntrian
                queueNumber={selectedQueue ? `${selectedQueue.queue_number}` : "___"}
                loketNumber={selectedLoket || "Pilih Loket"} // ? Gunakan loket yang dipilih
                location={category}
              />
              <PilihAksi
                selectedQueue2={selectedQueue2} // ?? Tetap mengirim antrian terakhir yang dipilih
                selectedQueueIds={selectedQueueIds} // ?? Mengirim banyak antrian yang dipilih
                setSelectedQueueIds={setSelectedQueueIds} // ?? Memungkinkan perubahan dari PilihAksi
                setSelectedQueue2={setSelectedQueue2}
                onStatusUpdate={() => {}}
                location={category}

              />
            </div>

            {/* Bagian Kanan - Daftar Antrian */}
            <div style={{ flex: "2", overflowY: "auto", maxHeight: "100%" }}>
              <DaftarAntrian
                onSelectQueue={onSelectQueue}
                selectedQueueIds={selectedQueueIds} // ?? Mengirim daftar nomor yang dipilih
                setSelectedQueueIds={setSelectedQueueIds} // ?? Agar bisa diperbarui dari DaftarAntrian
                setSelectedLoket={setSelectedLoket} // ? FIXED: Prop Name Corrected
                setSelectedQueue2={setSelectedQueue2}
                selectedQueue2={selectedQueue2}
                location={category}

              />
            </div>
          </div>
        </Content>

      </Layout>
        <Footer />

    </Layout>
  );
}
