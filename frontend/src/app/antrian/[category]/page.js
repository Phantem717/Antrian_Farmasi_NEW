'use client' // Keep this if using hooks/state/browser APIs


import InfoBar from '@/app/component/display/bpjs/InfoBar_b';
import MarqueeFooter from '@/app/component/display/bpjs/MarqueeFooter_b';
import PrintAntrian from '@/app/utils/api/printAntrian';
import WA_API from '@/app/utils/api/WA';
import VerificationAPI from '@/app/utils/api/Verification';
import DoctorAppointmentAPI from '@/app/utils/api/Doctor_Appoinment';
import PharmacyAPI from '@/app/utils/api/Pharmacy';
import createQueuePatientAPI from '@/app/utils/api/createQueuePatient';
import React, { useState, useEffect } from "react";
import { getSocket } from "@/app/utils/api/socket";
import { Button, Typography } from 'antd';
import { use } from 'react'; // Next.js 14+

export default function Antrian({ params }) {
  const { category } = use(params); // Directly destructure params
  const socket = getSocket();
  console.log(category);
  
  async function insertAll(payload){
    
  }

  async function handleButtonJaminan(){
    const resp = await createQueuePatientAPI.createAntrian('jaminan');  
    const respData = resp.data;
    console.log("RESP",resp);

  }

   async function handleButtonUmum(){
     const resp = await createQueuePatientAPI.createAntrian('umum');  
    const respData = resp.data;
    console.log("RESP",resp);
  }
  return (
    <div className="bg-slate-200 h-screen min-w-screen flex flex-col ">
      {/* Header and content - use flex-1 to allow footer space */}
      <div className="flex-1 overflow-auto p-4">
        <InfoBar location={category}/>
         
        <div className="flex flex-col flex-wrap gap-10  justify-center items-center ">
         <Typography.Title level={1} style={{ textAlign: "center", fontWeight:"bold", marginTop: "20px", fontSize: "100px" }} className="uppercase">
                      Pembuatan Antrian Farmasi GMCB
                    </Typography.Title>
            <Button
                size='large'
                color='primary'
                variant='solid'
                         onClick={() => handleButtonJaminan()}

                 style={{
                  padding: '75px',
                  'font-weight': 'bold',
                  'font-size': '120px',
                  'height': '250px'
                }}
                className="uppercase w-full"
            >Resep Jaminan</Button>
         <Button
         onClick={() => handleButtonUmum()}
                size='large'
                color='primary'
                variant='solid'
                style={{
                  padding: '75px',
                  'font-weight': 'bold',
                  'font-size': '120px',
                                    'height': '250px'

                }}
className="uppercase w-full"
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