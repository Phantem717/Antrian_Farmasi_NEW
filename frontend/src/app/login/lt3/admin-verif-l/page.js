"use client";

import React, { useState,useEffect } from "react";
import { Layout } from "antd";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DisplayAntrian from "@/app/component/lt3/admin-verif/DisplayAntrian_v-l";
import PilihAksi from "@/app/component/lt3/admin-verif/PilihTombol_v-l";
import DaftarAntrian from "@/app/component/lt3/admin-verif/DaftarAntrian_v-l";
import MovingText from "@/app/component/lt3/admin-verif/Movingtext_v";
import Sidebar from "@/app/component/Sidebar-l";
import QueueCall from "@/app/component/display/QueueCall";
const { Content } = Layout;
import {getSocket} from "@/app/utils/api/socket";
export default function Admin() {
  useEffect(() => {
    const socket = getSocket();
    console.log("CONNECTNG");
    socket.on('connect', () => {
      console.log("SOCKET CONNECTED");
    });

    socket.emit('test_ping', { message: "?? Manual test from client" });
    socket.emit('test_ping2', { message: "?? Manual test from client" });
    socket.on('test_pilih',(message)=>{
      console.log("PILIH TOMBOL CONNECTED3",message);
          });

          // return () => {
          //   socket.off('connect');
          //   socket.off('test_pilih');
          // }
  },[]);

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
                selectedQueue2={selectedQueue2} // ?? Tetap mengirim antrian terakhir yang dipilih
                selectedQueueIds={selectedQueueIds} // ?? Mengirim banyak antrian yang dipilih
                setSelectedQueueIds={setSelectedQueueIds} // ?? Memungkinkan perubahan dari PilihAksi
                setSelectedQueue2={setSelectedQueue2}
                onStatusUpdate={() => {}}
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
              />
            </div>
          </div>
        </Content>

        <Footer />
      </Layout>
    </Layout>
  );
}
