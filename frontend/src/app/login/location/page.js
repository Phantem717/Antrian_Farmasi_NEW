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

  const cardData = [
    {
      title: "Farmasi Rawat Jalan BPJS",
      image: "/images/bpjs.png",
      route: '/login/bpjs/admin-verif-b',
      imageSize: 350
    },
    {
      title: "Farmasi Umum GMCB",
      image: "/images/umum.png",
      route: '/login/bpjs/admin-verif-b',
      imageSize: 240
    },
    {
      title: "Farmasi Lantai 3 GMCB",
      image: "/images/umum.png", // Make sure this image exists
      route: '/login/bpjs/admin-verif-b',
      imageSize: 240
    }
  ];

  const cardStyle = {
    width: 500,
    height: 500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    cursor: "pointer",
    boxShadow: "-2px 6px 33px 0px rgba(0,0,0,0.83)",
    transition: "all 0.3s ease"
  };

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
          background: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "100px",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div className="text-black text-6xl font-bold uppercase"> 
            Layanan Antrian Farmasi RS Santo Carolus
          </div>

          <div className="flex flex-row flex-wrap justify-center items-center gap-10">
            {cardData.map((card, index) => (
              <Card
                key={index}
                style={cardStyle}
                className="hover:scale-105 hover:shadow-xl hover:border-4 hover:border-blue-500"
                hoverable
                onClick={() => router.push(card.route)}
              >
                <div className="flex justify-center">
                  <Image
                    src={card.image}
                    alt={card.title.toLowerCase()}
                    width={card.imageSize}
                    height={card.imageSize}
                    className="object-contain"
                  />
                </div>
                <div className="text-black text-4xl text-center font-bold">
                  {card.title}
                </div>
              </Card>
            ))}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Location;