"use client";

import React, { useState,useEffect,useCallback } from "react";
import { Layout } from "antd";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DisplayAntrian from "@/app/component/bpjs/admin-obat/DisplayAntrian-b";
import PilihAksi from "@/app/component/bpjs/admin-obat/PilihTombol-b";
import DaftarAntrian from "@/app/component/bpjs/admin-obat/DaftarAntrian-b";
import MovingText from "@/app/component/bpjs/admin-obat/Movingtext";
import Sidebar from "@/app/component/Sidebar-b";
import { useRouter, usePathname } from "next/navigation";
import { use } from 'react'; // Next.js 14+

const { Content } = Layout;
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
export default function Admin({params}) {
  const {category} = use(params);
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const [selectedLoket, setSelectedLoket] = useState("");
  const [selectedQueue, setSelectedQueue] = useState(null); 
  const [selectedQueueIds, setSelectedQueueIds] = useState([]); 
  const [selectedQueue2,setSelectedQueue2] = useState([]);
  const checkResponse = useTokenCheck();
 
  useEffect(( )=> {
    if(    !checkResponse){
      router.push("/login"); // Arahkan ke halaman login
    }
  },[useTokenCheck,router]) 
  return (
    <Layout style={{ height: "100vh", overflow: "hidden", backgroundColor: "#f0f0f0" }}  className="bg-gray-300">
      <Sidebar lokasi={category} collapsed={collapsed} setCollapsed={setCollapsed} />

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
            background: "#F0F0F0",
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
                justifyContent: "center",
              }}
            >
             <DisplayAntrian
                queueNumber={selectedQueue ? `${selectedQueue.queue_number}` : "___"}
                loketNumber={selectedLoket || "Pilih Loket"} // ? Gunakan loket yang dipilih
              />

              <PilihAksi
                selectedQueue={selectedQueue} // ? Kirim antrian yang dipilih
                selectedQueueIds={selectedQueueIds} // ? Kirim banyak antrian yang dipilih
                setSelectedQueueIds={setSelectedQueueIds} // ? Memungkinkan perubahan dari PilihAksi
                onStatusUpdate={() => {}}
                setSelectedQueue2={setSelectedQueue2}
                selectedQueue2={selectedQueue2}
                location={category}
              />
            </div>

            {/* Bagian Kanan - Daftar Antrian */}
            <div style={{ flex: "2", overflowY: "auto", maxHeight: "100%", marginBottom:"100px"}}>
            <DaftarAntrian 
              selectedQueueIds={selectedQueueIds} 
              setSelectedQueueIds={setSelectedQueueIds} 
              setSelectedQueue={setSelectedQueue} 
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
