//frontend\src\app\login\edit-marquee\page.js
"use client";

import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Form, notification } from "antd";
import Sidebar from "@/app/component/Sidebar-b";

const { Content } = Layout;

const EditMarquee = () => {
  const [messages, setMessages] = useState(["", ""]);

  useEffect(() => {
    const storedMessages = localStorage.getItem("marqueeMessages");
    let parsedMessages = [
      "Selamat datang, silahkan menunggu panggilan antrian. Terima Kasih.",
      "@Display Klinik Pratama Paseban 2024 - SIRS Developer Team"
    ];
  
    if (storedMessages) {
      try {
        parsedMessages = JSON.parse(storedMessages);
      } catch (error) {
        console.error("Gagal membaca marqueeMessages dari localStorage:", error);
      }
    }
  
    setMessages(parsedMessages);
  }, []);
  

  const handleSave = () => {
    localStorage.setItem("marqueeMessages", JSON.stringify(messages));

    notification.open({
        message: "Sukses",
        description: "Marquee berhasil diperbarui!",
        placement: "topRight",
        duration: 2, // Notifikasi hilang setelah 2 detik
      });
    
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout style={{ marginLeft: 300, padding: "24px", background: "#fff" }}>
        <Content>
          <h2>Edit Marquee Footer</h2>
          <Form layout="vertical">
            <Form.Item label="Pesan Marquee Pertama">
              <Input
                value={messages[0]}
                onChange={(e) => setMessages([e.target.value, messages[1]])}
              />
            </Form.Item>
            <Form.Item label="Pesan Marquee Kedua">
              <Input
                value={messages[1]}
                onChange={(e) => setMessages([messages[0], e.target.value])}
              />
            </Form.Item>
            <Button type="primary" onClick={handleSave}>
              Simpan Perubahan
            </Button>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditMarquee;
