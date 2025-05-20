'use client'
import QueueCall from '@/app/component/display/lt3/QueueCall_l';
import ServingQueue from '@/app/component/display/lt3/ServingQueue_l';
import MissQueue from '@/app/component/display/lt3/MissQueue_l';
import NextQueue from '@/app/component/display/lt3/NextQueue_l';
import InfoBar from '@/app/component/display/lt3/InfoBar_l';
import MarqueeFooter from '@/app/component/display/lt3/MarqueeFooter_l';
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
      const response = await responses.getAllResponses("Lantai 3 GMCB");
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
    <div className="bg-white min-h-screen min-w-screen flex flex-col p-4 overflow-auto">
      {/* Kontainer Utama */}
      <div className="w-full mb-4 overflow-auto">
        <InfoBar />
      </div>

      {/* Baris pertama: QueueCall, ServingQueue, dan MissedQueue */}
      <div className="flex flex-row gap-4 mb-4 overflow-auto">
        <div className="flex-[1] basis-[40%] overflow-auto">
          <QueueCall />
        </div>
        <div className="flex-[1.2] basis-[20%] overflow-auto">
          <ServingQueue />
        </div>
        <div className="flex-[1.8] basis-[40%] overflow-auto">
        <MissQueue/>
        </div>
      </div>

      {/* Baris kedua: NextQueue */}
      <div className="w-full mb-4 overflow-auto">
        <NextQueue />
      </div>

      {/* Footer */}
      <MarqueeFooter />
    </div>
  );
}