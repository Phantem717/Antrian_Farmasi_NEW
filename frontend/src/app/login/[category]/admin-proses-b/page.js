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
import { getSocket } from "@/app/utils/api/socket";
const { Content } = Layout;
import { use } from "react";
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
  const {category} =use(params);
      const socket = getSocket();

  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const [scanResult, setScanResult] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [daftarAntrian, setDaftarAntrian] = useState([]);
  const checkResponse = useTokenCheck();

  // Fetch queue list
  useEffect(() => {
      if (!checkResponse) {
        router.push("/login");
        return;
      }
   
    
  }, [useTokenCheck, router]); // Now stable dependencies

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
      <Sidebar  lokasi={category} collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: siderWidth, display: "flex", flexDirection: "column" }}>
        <Header style={{height: "50vh"}} />
        <MovingText />
        <Content style={{ flex: 1, padding: "24px", background: "#F0F0F0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: "24px", flex: 1 }}>
            <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
              <BarcodeScanner 
              location={category}
                onScanResult={handleScanResult} 
              />
              <p style={{ fontWeight: "bold", marginTop: "10px", textAlign: "center" }}>
                {scanResult && `?? Hasil Scan: ${scanResult}`}
              </p>
            </div>
            <div style={{ flex: "2", overflowY: "auto", maxHeight: "100%" }}>
              <DaftarAntrian
              location={category}

                scanResult={scanResult}
                setIsDeleted={setIsDeleted}
              />
            </div>
          </div>
        </Content>
      </Layout>
        <Footer />

    </Layout>
  );
}