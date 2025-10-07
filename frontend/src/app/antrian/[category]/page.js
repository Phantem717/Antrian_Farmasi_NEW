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
    console.log("PAYLOAD",payload);
     const appointmentData = {
      queue_number: payload.queue_number,
      patient_name: payload.patient_name,
      status_medicine: payload.statusMedicine,
      lokasi: payload.lokasi,
      farmasi_queue_number: payload.queue_number,
      NOP: payload.NOP,
        sep_no: "-",
      queue_status: "-",
      queue_type: "-",
      patient_name: "-",
      medical_record_no: "-",
      patient_date_of_birth: null,
      phone_number: "-",
      doctor_name: "-",
      nik: "-",
      PRB: "-",
      total_medicine:  0
    };

    console.log("APP_DATA",appointmentData);

    const pharmacyPayload = {
      NOP: payload.NOP,
      status: "waiting_verification",
      medicine_type: payload.statusMedicine,
      lokasi: payload.lokasi,
    };

    const taskData = {
      NOP: payload.NOP,
      Executor: "-",
      Executor_Names: "-",
      status: null,
      location: payload.lokasi,
    };

  const [doctorAppointment, pharmacyData] = await Promise.all([
  DoctorAppointmentAPI.createAppointment(appointmentData),
  PharmacyAPI.createPharmacyTask(pharmacyPayload)
]);
// then verification, since it depends on pharmacy
const verificationData = await VerificationAPI.createVerificationTask(
taskData);
    return { doctorAppointment, pharmacyData, verificationData };
  }

  async function handleButtonJaminan(){
    const resp = await createQueuePatientAPI.createAntrian('jaminan');  
    console.log("RESP",resp);
    const date = new Date();
    const date_today =  date.getFullYear().toString() +
  String(date.getMonth() + 1).padStart(2, '0') +
  String(date.getDate()).padStart(2, '0');
  
    let new_NOP = `NOP/${date_today}/${resp.queue_number}`;
    const payload = {
      NOP: new_NOP,
      queue_number: resp.queue_number,
      farmasi_queue_number: resp.queue_number,
      statusMedicine: "Jaminan",
      lokasi: category
    }
    const insertResp = await insertAll(payload);
    console.log("RESP",resp, insertResp);
   socket.emit('update_verif',{location});
      socket.emit('update_display',{location});
  }

   async function handleButtonUmum(){
     const resp = await createQueuePatientAPI.createAntrian('umum');  
    console.log("RESP",resp);
    const date = new Date();
    const date_today =  date.getFullYear().toString() +
  String(date.getMonth() + 1).padStart(2, '0') +
  String(date.getDate()).padStart(2, '0');

    let new_NOP = `NOP/${date_today}/${resp.queue_number}`;
    const payload = {
      NOP: new_NOP,
      queue_number: resp.queue_number,
      farmasi_queue_number: resp.queue_number,
      statusMedicine: "Umum",
      lokasi: category
    }
    const insertResp = await insertAll(payload);
    console.log("RESP",resp, insertResp);
    socket.emit('update_verif',{location});
      socket.emit('update_display',{location});
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