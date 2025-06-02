'use client'
import QueueCall from '@/app/component/display/bpjs/QueueCall_b';
import ServingQueue from '@/app/component/display/bpjs/ServingQueue_b';
import MissQueue from '@/app/component/display/bpjs/MissQueue_b';
import NextQueue from '@/app/component/display/bpjs/NextQueue_b';
import InfoBar from '@/app/component/display/bpjs/InfoBar_b';
import MarqueeFooter from '@/app/component/display/bpjs/MarqueeFooter_b';
import React, { useState,useEffect } from "react";
import {getSocket} from "@/app/utils/api/socket";
import responses from "@/app/utils/api/responses";
import { getReactRender } from 'antd/es/config-provider/UnstableContext';


export default function Display() {
const [loading,setLoading] = useState();
const [verificationData,setVerificationData]= useState([]);
const [pickupData,setPickupData]= useState([]);
const [medicineData,setMedicineData]= useState([]);
const [loketData,setLoketData] = useState([]);

const socket = getSocket();
  async function getResponses(){
    setLoading(true);
    try {
      const response = await responses.getAllResponses("Lantai 1 BPJS");
      console.log(response.data);
        console.log("VERIFDATA2",verificationData);
        setVerificationData(response.data.verificationData);
        setPickupData(response.data.pickupData);
        setMedicineData(response.data.medicineData);
        setLoketData(response.data.loketData);
      
    } catch (error) {
      console.log("ERROR GETTIGN RESPONSES: ",error)
      throw error;
    }
    setLoading(false);
  }
  useEffect(()=>{
    const socket = getSocket();
    socket.on('test_ping2', (message) => {
      console.log("?? Received test_ping:", message);
      socket.emit("test_pong", { message: "? Server is alive!" });
    });


    socket.on('update_status_medicine_type',(payload)=>{
      console.log("PILIH TOMBOL CONNECTED2",payload.message, payload.data);
          });
    
  },[socket])
   useEffect(()=>{
    
      getResponses();
      const interval = setInterval(()=>{
        if (!loading) {
          getResponses();
        }
      }, 5000); // Refresh setiap 10 detik
      return () => clearInterval(interval);

      // return () => {
      //   socket.off('test_ping2');
      //   socket.off('test_pilih');
      // }
            
    },[]);
    return (
      <div className="bg-white h-screen min-w-screen flex flex-col">
        {/* Header and content - use flex-1 to allow footer space */}
        <div className="flex-1 overflow-auto p-4">
          <InfoBar />
          <div className="flex flex-row gap-4 mb-4 h-[calc(100%-3rem)]">
            <NextQueue lokasi="Lantai 1 BPJS" />
            <QueueCall lokasi="Lantai 1 BPJS" />
          </div>
        </div>
        
        {/* Footer - will stick to bottom */}
        <div className="w-full">
          <MarqueeFooter />
        </div>
      </div>
    );
}