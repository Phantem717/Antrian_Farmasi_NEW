'use client' // Keep this if using hooks/state/browser APIs


import InfoBar from '@/app/component/display/bpjs/InfoBar_b';
import MarqueeFooter from '@/app/component/display/bpjs/MarqueeFooter_b';
import PrintAntrian from '@/app/utils/api/printAntrian';
import WA_API from '@/app/utils/api/WA';
import VerificationAPI from '@/app/utils/api/Verification';
import DoctorAppointmentAPI from '@/app/utils/api/Doctor_Appoinment';
import PharmacyAPI from '@/app/utils/api/Pharmacy';

import React, { useState, useEffect } from "react";
import { getSocket } from "@/app/utils/api/socket";
import { Button, Typography } from 'antd';

export default function Antrian({ params }) {
  const { category } = params; // Directly destructure params
  const socket = getSocket();
  console.log(category);
  
  async function insertAll(payload){
    
  }

  async function handleButtonJaminan(){

  }

   async function handleButtonUmum(){
    
  }
  return (
    <div className="bg-white h-screen min-w-screen flex flex-col">
      {/* Header and content - use flex-1 to allow footer space */}
      <div className="flex-1 overflow-auto p-4">
        <InfoBar location={category}/>
         <Typography.Title level={1} style={{ textAlign: "center" }}>
                      Pembuatan Antrian Farmasi GMCB
                    </Typography.Title>
        <div className="flex flex-column flex-wrap gap-4 mb-4 h-[calc(100%-3rem)] justify-center items-center">
         
            <Button
                size='large'
                color='primary'
                variant='solid'
                 style={{
                  padding: '75px',
                  'font-weight': 'bold',
                  'font-size': '75px'
                }}
            >Resep Jaminan</Button>
         <Button
                size='large'
                color='primary'
                variant='solid'
                style={{
                  padding: '75px',
                  'font-weight': 'bold',
                  'font-size': '75px'
                }}

            >Resep Umum</Button>
        
        </div>
      </div>
      
      {/* Footer - will stick to bottom */}
      <div className="w-full">
        <MarqueeFooter />
      </div>
    </div>
  );
}