"use client";

import React, { useEffect, useState,useCallback } from "react";
import { Layout,Form } from "antd";
import {
  Box,
  Select,
  MenuItem,
  Typography,
  Button
  

} from "@mui/material";
import Header from "@/app/component/Header";
import Footer from "@/app/component/Footer";
import DisplayAntrian from "@/app/component/bpjs/admin-obat/DisplayAntrian-b";
import PilihAksi from "@/app/component/bpjs/admin-obat/PilihTombol-b";
import DaftarAntrian from "@/app/component/bpjs/admin-obat/DaftarAntrian-b";
import MovingText from "@/app/component/bpjs/admin-obat/Movingtext";
import Sidebar from "@/app/component/Sidebar-b";
import TableLogs from '@/app/component/logs/tableLogs'
import BarChart from '@/app/component/logs/barDataPerHour'
const { Content } = Layout;
import { useRouter, usePathname } from "next/navigation";
import MedicineTypeCard from '@/app/component/logs/medicineTypeCard'
import AvgServiceTime from "@/app/component/logs/avgServiceTime";
import { use } from "react";
import { DatePicker } from "antd";

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
export default function Logs({params}) {
   const { category } = params;
  const [isSubmit, setIsSubmit] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null
  });
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const dateFormat = "YYYY-MM-DD";

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
  
 const changeFromDate = (date, dateString) => {
    setFilters(prev => ({ ...prev, fromDate: dateString }));
  };

  const changeToDate = (date, dateString) => {
    setFilters(prev => ({ ...prev, toDate: dateString }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!filters.fromDate || !filters.toDate) return;
    
    // Trigger refresh by updating the key and isSubmit state
    setIsSubmit(true);
  };

  const handleClear = async () => {
    setFilters({ fromDate: null, toDate: null });
  setIsSubmit(false);
  setIsSubmit(true);
  };  

  return (
    <Layout style={{ minheight: "100vh", overflow: "hidden" }}>
      <Sidebar  lokasi={category} collapsed={collapsed} setCollapsed={setCollapsed} />

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
            marginBottom:"25px"
          }}
        >
          <form className="flex flex-row gap-5 flex-wrap w-full mb-5" onSubmit={handleSubmit}>

      

<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <div className="w-[200px] z-10">
    <Typography
    className="font-bold text-2xl"
    >From Date: </Typography>
 <DatePicker 
            size="large"
            required
            onChange={changeFromDate} 
                maxDate={dayjs(new Date().toISOString(), dateFormat)}
        value={filters.fromDate ? dayjs(filters.fromDate) : null}

            />  </div>
 
</Box>

<Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <div className="w-[200px] z-10">
        <Typography
            className="font-bold text-2xl"
>To Date: </Typography>

 <DatePicker 
            size="large"
            required
            onChange={changeToDate} 
                maxDate={dayjs(new Date().toISOString(), dateFormat)}
                    value={filters.toDate ? dayjs(filters.toDate) : null}

            />  
 
            </div>


    
</Box>
          <Button
          color="primary"
          variant="contained"
          type="submit"
          size="large"
          >Submit</Button>

          {(filters.fromDate || filters.toDate) && (
                <Button
                  color="secondary"
                  variant="contained"
                  size="large"
                  onClick={handleClear}
                >
                  Clear
                </Button>
              )}
          </form>
      <MedicineTypeCard 
            key={`medicine-${isSubmit}`}
            isSubmit={isSubmit}
                                    setIsSubmit={setIsSubmit}

            fromDate={filters.fromDate}

            toDate={filters.toDate}
            location={category}
          />
          
          <BarChart 
            key={`chart-${isSubmit}`}
            isSubmit={isSubmit}
            setIsSubmit={setIsSubmit}
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            location={category}
          />
          
          <AvgServiceTime
            key={`avg-${isSubmit}`}
            isSubmit={isSubmit}
                        setIsSubmit={setIsSubmit}

            fromDate={filters.fromDate}
            toDate={filters.toDate}
            location={category}
          />
                  <TableLogs   location={category}
         />
        </Content>

      </Layout>
        <Footer />

    </Layout>
  );
}
