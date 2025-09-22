"use client";

import React, { useState } from "react";
import { Layout, Card } from "antd";
import Header from "@/app/component/Header";
import MovingText from "@/app/component/bpjs/admin-verif/Movingtext_v";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/component/Sidebar-b";

const { Content } = Layout;

const Location = () => {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const router = useRouter();

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isLocation={true} />
      
      <Layout style={{
        marginLeft: siderWidth,
        transition: "margin-left 0.3s ease-in-out",
        display: "flex",
        flexDirection: "column",
      }}>
        <Header />
              <MovingText />

        <Content style={{
          flex: 1,
          padding: "24px",
          background: "#F0F0F0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "100px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F0F0F0",
        }}>
            
          <div className="text-black text-6xl font-bold uppercase"> 
            Layanan Antrian Farmasi RS Santo Carolus
          </div>

         
        </Content>
      </Layout>
    </Layout>
  );
};

export default Location;