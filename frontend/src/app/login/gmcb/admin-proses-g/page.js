"use client";

import React, { useState, useEffect } from "react"; // ✅ Tambahkan import yang benar
import { Layout } from "antd";
import Swal from "sweetalert2";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DaftarAntrian from "@/app/component/gmcb/admin-proses/DaftarAntrian_p-g";
import MovingText from "@/app/component/gmcb/admin-proses/Movingtext_g";
import Sidebar from "@/app/component/Sidebar-g";
import BarcodeScanner from "@/app/component/gmcb/admin-proses/BarcodeScanner-g";
import PharmacyAPI from "@/app/utils/api/Pharmacy"; // ✅ Tambahkan import untuk API

const { Content } = Layout;

export default function Admin() {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;

  const [scanResult, setScanResult] = useState(""); // ✅ Simpan hasil scan
  const [isDeleted, setIsDeleted] = useState(false); // ✅ Untuk menghapus input scanner
  const [daftarAntrian, setDaftarAntrian] = useState([]); // ✅ Simpan daftar antrian

  // ✅ Ambil daftar antrian dari API
  useEffect(() => {
    const fetchQueueList = async () => {
      try {
        const response = await PharmacyAPI.getAllPharmacyTasks();
        console.log("📡 Data antrian dari API:", response.data);
        setDaftarAntrian(response.data);
      } catch (error) {
        console.error("❌ Error fetching queue list:", error);
      }
    };

    fetchQueueList();
    const interval = setInterval(fetchQueueList, 10000); // Refresh tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const handleScanResult = (data) => {
    console.log("📡 Hasil Scan diterima:", data);
    setScanResult(data);
    setIsDeleted(false);
  };

  useEffect(() => {
    if (isDeleted) {
      console.log("🗑️ Mengosongkan scan input...");
      setScanResult("");
    }
  }, [isDeleted]);

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: siderWidth, display: "flex", flexDirection: "column" }}>
        <Header />
        <MovingText />
        <Content style={{ flex: 1, padding: "24px", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "24px", flex: 1 }}>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
              <BarcodeScanner 
                onScanResult={handleScanResult} 
                daftarAntrian={daftarAntrian} // ✅ Kirim daftar antrian ke BarcodeScanner
              />
              <p style={{ fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>
                {scanResult && `📡 Hasil Scan: ${scanResult}`}
              </p>
            </div>
            <div style={{ flex: "2", overflowY: "auto", maxHeight: "100%" }}>
              <DaftarAntrian
                scanResult={scanResult}
                setIsDeleted={setIsDeleted}
              />
            </div>
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
