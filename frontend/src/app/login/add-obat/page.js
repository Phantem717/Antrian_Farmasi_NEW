"use client";

import React, { useState, useRef } from "react";
import {
  Layout,
  Button,
  Input,
  Typography,
  Select,
  Form,
} from "antd";
import Header from "@/app/component/Header";
import MovingText from "@/app/component/bpjs/admin-verif/Movingtext_v";
import Sidebar from "@/app/component/Sidebar-b";

const { Content } = Layout;
const { Option } = Select;

const AddObat = () => {
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;

  const [inputValue, setInputValue] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [name, setName] = useState("");

  const isBarcoded = useRef(false);
  const isTyped = useRef(false);
  const inputRef = useRef(null);

  const handleChange = (value) => {
    setLokasi(value);
    isTyped.current = true;
  };

  async function clearField() {
    setInputValue("");
    setName("");
    setLokasi("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  async function handleSubmit() {
    try {
      if (!inputValue || !name || !lokasi) {
        return alert("❌ Mohon lengkapi semua data.");
      }

      // 👉 do your API calls here

      alert("✅ Data berhasil diproses!");
      await clearField();
    } catch (error) {
      console.error("Error saat memproses:", error);
      alert("❌ Gagal memproses: " + error.message);
      await clearField();
    }
  }

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isLocation={true}
      />

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Typography.Title level={1} style={{ textAlign: "center" }}>
            Pembuatan Antrian Farmasi GMCB
          </Typography.Title>

          <Form
            layout="vertical"
            onFinish={handleSubmit}
            style={{
              width: 1000,
              background: "#fff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Form.Item  required>
                            <Typography className="font-bold text-2xl mb-2">Input Nomor Rekam Medis</Typography>

              <Input
              size="large"
                ref={inputRef}
                value={inputValue}
                variant="outlined"
                onChange={(e) =>
                  setInputValue(e.target.value.replace(/\s+/g, ""))
                }
              />
            </Form.Item>

            <Form.Item  required>
              <Typography className="font-bold text-2xl mb-2">Input Nama Pasien</Typography>
              <Input              
              size="large"
              variant="outlined"
              value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Item>

            <Form.Item required>
              <Typography className="font-bold text-2xl mb-2">Pilih Lokasi Farmasi</Typography>
              <Select
                value={lokasi}
                onChange={handleChange}
                size="large"
                placeholder="Pilih Lokasi"
              >
                <Option value="lt1">Lantai 1 GMCB</Option>
                <Option value="lt3">Lantai 3 GMCB</Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={!isBarcoded.current && !isTyped.current}
              size="large"
            >
              Submit
            </Button>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddObat;
