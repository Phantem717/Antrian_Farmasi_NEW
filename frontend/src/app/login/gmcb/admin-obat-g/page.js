"use client";

import React, { useState } from "react";
import { Layout } from "antd";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DisplayAntrian from "@/app/component/gmcb/admin-obat/DisplayAntrian-g";
import PilihAksi from "@/app/component/gmcb/admin-obat/PilihTombol-g";
import DaftarAntrian from "@/app/component/gmcb/admin-obat/DaftarAntrian-g";
import MovingText from "@/app/component/gmcb/admin-obat/Movingtext";
import Sidebar from "@/app/component/Sidebar-g";

const { Content } = Layout;

export default function Admin() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const [selectedLoket, setSelectedLoket] = useState("");
  const [selectedQueue, setSelectedQueue] = useState(null); 
  const [selectedQueueIds, setSelectedQueueIds] = useState([]); 
  const [selectedQueue2,setSelectedQueue2] = useState([]);

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
              />
            </div>

            {/* Bagian Kanan - Daftar Antrian */}
            <div style={{ flex: "2", overflowY: "auto", maxHeight: "100%" }}>
            <DaftarAntrian 
              selectedQueueIds={selectedQueueIds} 
              setSelectedQueueIds={setSelectedQueueIds} 
              setSelectedQueue={setSelectedQueue} 
              setSelectedLoket={setSelectedLoket} // ? FIXED: Prop Name Corrected
              setSelectedQueue2={setSelectedQueue2}
              selectedQueue2={selectedQueue2}
              />

            </div>
          </div>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
}
