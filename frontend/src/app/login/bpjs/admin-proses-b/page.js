"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "antd";
import Swal from "sweetalert2";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DaftarAntrian from "@/app/component/bpjs/admin-proses/DaftarAntrian_p-b";
import MovingText from "@/app/component/bpjs/admin-proses/Movingtext_p";
import Sidebar from "@/app/component/Sidebar-b";
import BarcodeScanner from "@/app/component/bpjs/admin-proses/BarcodeScanner-b";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import { useRouter, usePathname } from "next/navigation";

const { Content } = Layout;

export default function Admin() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const [scanResult, setScanResult] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [daftarAntrian, setDaftarAntrian] = useState([]);
  const token = localStorage.getItem("token");

  // Memoize the token check function with useCallback
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
  }, [token]); // Only recreate when token changes

  // Fetch queue list
  useEffect(() => {
    const fetchQueueList = async () => {
      if (checkTokenExpired()) {
        router.push("/login");
        return;
      }

      try {
        const response = await PharmacyAPI.getAllPharmacyTasks();
        console.log("?? Data antrian dari API:", response.data);
        setDaftarAntrian(response.data);
      } catch (error) {
        console.error("? Error fetching queue list:", error);
      }
    };

    fetchQueueList();
    const interval = setInterval(fetchQueueList, 10000);
    return () => clearInterval(interval);
  }, [checkTokenExpired, router]); // Now stable dependencies

  const handleScanResult = (data) => {
    console.log("?? Hasil Scan diterima:", data);
    setScanResult(data);
    setIsDeleted(false);
  };

  useEffect(() => {
    if (isDeleted) {
      console.log("??? Mengosongkan scan input...");
      setScanResult("");
    }
  }, [isDeleted]);

  return (
    <Layout style={{ height: "150vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: siderWidth, display: "flex", flexDirection: "column" }}>
        <Header style={{height: "50vh"}} />
        <MovingText />
        <Content style={{ flex: 1, padding: "24px", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "24px", flex: 1 }}>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
              <BarcodeScanner 
                onScanResult={handleScanResult} 
                daftarAntrian={daftarAntrian}
              />
              <p style={{ fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>
                {scanResult && `?? Hasil Scan: ${scanResult}`}
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