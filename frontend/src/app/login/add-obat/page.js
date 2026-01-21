"use client";
import Swal from "sweetalert2";
import React, { useState, useRef } from "react";
import { Layout, Button, Input, Typography, Form } from "antd";

import Header from "@/app/component/Header";
import MovingText from "@/app/component/bpjs/admin-verif/Movingtext_v";
import Sidebar from "@/app/component/Sidebar-b";
import GMCBAppointmentAPI from "@/app/utils/api/GMCB_Appointment";
import CheckRegistrationAPI from "@/app/utils/api/checkRegistrationInfo";
import PharmacyAPI from "@/app/utils/api/Pharmacy";        // ✅ make sure these exist
import VerificationAPI from "@/app/utils/api/Verification"; // ✅
import WA_API from "@/app/utils/api/WA";
import CreateAntrianAPI from "@/app/utils/api/createAntrian";
import PrintAntrian from "@/app/utils/api/printAntrian";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode";
import { getSocket } from "@/app/utils/api/socket";
const AddObat = () => {
  const { Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const socket = getSocket();
  const [name, setName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  async function clearField() {
    setInputValue("");
    setName("");
    if (inputRef.current) inputRef.current.focus();
  }

  async function insertAll(payload) {
    console.log("PAYlOAD", payload);
    const appointmentData = {
   sep_no: payload.sep_no || "-",
      queue_number: payload.queue_number || "-",
      queue_status: payload.queue_status  || "-",
      patient_name: payload.patient_name  || "-",
      medical_record_no: payload.medical_record_no  || "-",
      patient_date_of_birth: payload.patient_date_of_birth  || "-",
      medicine_type: payload.status_medicine  || "-",
      lokasi: payload.location  || "-",
      phone_number: payload.phone_number  || "-",
      doctor_name: payload.doctor_name  || "-",
      nik: payload.nik  || "-",
      NOP: payload.NOP  || "-",
      isPaid: payload.isPaid  || "-",
      payment_type: payload.payment_type  || "-",
      location_from: payload.location_from  || "-",
      total_medicine: payload.total_medicine  || "0",
      poliklinik: payload.poliklinik  || "-",
    };

    try {
        console.log("APPOINTMENT DATA",appointmentData);

    const pharmacyPayload = {
      NOP: payload.NOP,
      status: "waiting_verification",
      medicine_type: payload.status_medicine,
      lokasi: payload.location,
    };

        
    const taskData = {
      NOP: payload.NOP,
      Executor: "-",
      Executor_Names: "-",
      status: null,
      location: payload.location, // ✅ fixed
    };
        console.log("PHARMACY DATA",pharmacyPayload);

    const [doctorAppointment, pharmacyData] = await Promise.all([
      GMCBAppointmentAPI.createAppointment(appointmentData),
      PharmacyAPI.createPharmacyTask(pharmacyPayload),
    ]);
    
    const verificationData = await VerificationAPI.createVerificationTask(taskData);
    
    // ✅ Map location to short code before emitting
    const locationMap = {
        "Lantai 1 BPJS": "bpjs",
        "Lantai 1 GMCB": "gmcb",
        "Lantai 3 GMCB": "lt3"
    };
    const shortLocation = locationMap[payload.location] || payload.location;
    
    console.log(`📤 [add-obat] Emitting for: ${payload.location} => ${shortLocation}`);
    
    socket.emit('update_verif', {location: shortLocation});
    socket.emit('update_display', {location: shortLocation});
    
    return { doctorAppointment, pharmacyData, verificationData };
    } catch (error) {
          console.error('Error during insertion, attempting rollback:', error);
      await Promise.allSettled([
      GMCBAppointmentAPI.deleteAppointment(payload.NOP).catch(() => {}),
      PharmacyAPI.deletePharmacyTask(payload.NOP).catch(() => {}),
      VerificationAPI.deleteVerificationTask(payload.NOP).catch(() => {})
    ]);

    throw new Error('Failed to create records, Silakan coba lagi');
    }
  
  }

  async function handleSubmit() {
    try {
      if (!inputValue || !name) {
        return Swal.fire("❌", "Mohon lengkapi semua data.", "error");
      }

      const response = await CheckRegistrationAPI.checkQueueERM(name, inputValue);
      const dataNOP = response.data[0];

      const data = await CheckRegistrationAPI.checkQueue(dataNOP.RegistrationNo);
      console.log("RESPONSE",response, data);
      // ✅ setState normally

      Swal.fire({
        title: "Konfirmasi Data Pasien",
        html: `
          <div style="text-align: left; line-height: 1.8;" class="flex justify-center flex-col">
                   <div class="font-bold text-lg"><strong>NOP:</strong> 🆔 ${data.RegistrationNo || "-"}</div>
            <div class="font-bold text-lg"><strong>Patient Name:</strong> 👤 ${data.PatientName || "-"}</div>
            <div class="font-bold text-lg"><strong>Dokter:</strong> 🩺 ${data.ParamedicName || "-"}</div>
            <div class="font-bold text-lg"><strong>No. RM:</strong> 🚑 ${data.MedicalNo || "-"}</div>
            <div class="font-bold text-lg"><strong>Phone Number:</strong> 📱 ${data.MobilePhoneNo1 || "-"}</div>
            <div class="font-bold text-lg"><strong>NIK:</strong> 🆔 ${data.SSN || "-"}</div>
            <div class="font-bold text-lg"><strong>Payment Type:</strong> 🪙 ${data.BusinessPartnerName || "-"}</div>
            <div class="font-bold text-lg"><strong>Service Unit Name:</strong> 👨‍⚕️ ${data.ServiceUnitName || "-"}</div>
            <div class="font-bold text-lg"><strong>Is Paid:</strong> 💰 ${data.LastPaymentDate == 1 ? "true" : "false" || "-"}</div>

            
            <div style="margin-top: 20px;">
              <label style="font-weight: bold; display: block; margin-bottom: 8px;">
                Pilih Lokasi Farmasi
              </label>
              <select class="font-bold text-lg" id="lokasiSelect" style="width: 100%; padding: 8px;">
                <option value="gmcb">Lantai 1 GMCB</option>
                <option value="lt3">Lantai 3 GMCB</option>
              </select>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "✅ Data Sesuai",
        cancelButtonText: "❌ Data Tidak Sesuai",
        allowOutsideClick: false,
     preConfirm: async () => {
            let selectedLokasi = document.getElementById("lokasiSelect").value;
            let apiLokasi;
            
            // Fix assignment/comparison bug
            if(selectedLokasi === 'gmcb'){
                selectedLokasi = "Lantai 1 GMCB"
                apiLokasi="farmasi-gmcb-lt1"
            }
            else{
                selectedLokasi= "Lantai 3 GMCB"
                apiLokasi="farmasi-gmcb-lt3"
            }
            
            try {
                // 1. Get Medicine Type Info
                const med_type_resp = await BPJSBarcodeAPI.fetchRegistrationInfo(data.RegistrationNo);
                
                // 2. Determine med_type locally
                let med_type_local = (med_type_resp.message == "Tidak ada racikan") ? "Non - Racikan" : "Racikan";
                let total_medicine = med_type_resp.data?.length ?? 0 ;
                const origin = data.ServiceUnitName;
                // 3. Create Queue and get queue number
                const create_antrian_resp = await CreateAntrianAPI.createAntrianGMCB(med_type_local, apiLokasi,origin);
                const queueData = create_antrian_resp.data;
                const queueNumber_local = queueData.data.queue_number;
                console.log("QUEUE",queueData,queueNumber_local);
                // 4. Update State (Optional, for UI display only)
         
                // 5. CRITICAL: Build payload using LOCAL/IMMEDIATE variables
                const payload = {
                    queue_status: "Menunggu",
              NOP: data.RegistrationNo,
              patient_name: data.PatientName,
              patient_date_of_birth: data.DateOfBirth,
              nik: data.SSN,
              medical_record_no: data.MedicalNo,
              phone_number: data.MobilePhoneNo1,
              doctor_name: data.ParamedicName,
              status_medicine: med_type_local, 
              location: selectedLokasi,
              queue_number: queueNumber_local,
              total_medicine: total_medicine,
              isPaid: data.LastPaymentDate,
              location_from: data.ServiceUnitName,
              payment_type: data.BusinessPartnerName,
              sep_no: data.NoSEP,
              poliklinik: data.ServiceUnitName
                };

                return payload; // Return the fully constructed payload
            } catch (error) {
                console.error("Error saat memproses:", error);
                throw error;
            }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const resultData = result.value;
            console.log("DATA", resultData, result.value);
            const WAPayload = {
            phone_number: resultData.phone_number ?? "-",
            NOP: resultData.NOP ?? "-",
            docter: resultData.ParamedicName??"-",
            nik: resultData.nik??"-",
            sep: "-",
            barcode: resultData.NOP ?? "-",
            patient_name: resultData.patient_name ?? "-",
            farmasi_queue_number: resultData.queue_number ?? "-",
            medicine_type: resultData.status_medicine ?? "-",
            rm: resultData.medical_record_no??"-",
            tanggal_lahir: new Date(resultData.patient_date_of_birth).toISOString().split('T')[0]??"-",
            queue_number: resultData.queue_number  ?? null,
            prev_queue_number: "-",
            location: location
        };

           const printPayload = {
            phone_number: resultData.phone_number ?? "-",
            NOP: resultData.NOP ?? "-",
            docter: resultData.doctor_name??"-",
            nik: resultData.nik??"-",
            barcode: resultData.NOP ?? "-",
            patient_name: resultData.patient_name ?? "-",
            farmasi_queue_number: resultData.queue_number ?? "-",
            medicine_type: resultData.status_medicine ?? "-",
            SEP:  "-",
            tanggal_lahir:  new Date(resultData.patient_date_of_birth).toISOString().split('T')[0]??"-",
            queue_number: resultData.queue_number  ?? null,
            PRB: resultData.PRB,
            switch_WA: localStorage.getItem('waToggleState') || "true",
            lokasi: location
        }
            await insertAll(resultData);
            const print_wa = await Promise.all([WA_API.sendWAAntrian(WAPayload),PrintAntrian.printAntrian(printPayload)]);
            console.log("PRINT_WA",print_wa);
            Swal.fire("Success!", "Data berhasil disimpan", "success");
     

          } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error!", "Gagal menyimpan data", "error");
          }
        } else {
          clearField();
        }
      });
    } catch (error) {
      console.error("Error saat memproses:", error);
      Swal.fire("❌", "Gagal memproses: " + error.message, "error");
      clearField();
    }
  }

  return (
    <Layout style={{ height: "100vh", overflow: "hidden", width: "100%" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} isLocation={true} lokasi ="gmcb" />
      <Layout
        style={{
          marginLeft: siderWidth,
          transition: "margin-left 0.3s ease-in-out",
          display: "flex",
      
        }}
        className="w-full"
      >
        <Header />
        <MovingText />
        <Content style={{ display:"flex", padding: "24px", background: "#F0F0F0", overflow: "auto", width: "100%", alignItems:"center", "flex-direction":"column" }}>
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
            <Form.Item required>
              <Typography className="font-bold text-2xl mb-2">Input Nomor Rekam Medis</Typography>
              <Input
                size="large"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.replace(/\s+/g, ""))}
                placeholder="Masukkan Nomor Rekam Medis"
              />
            </Form.Item>

            <Form.Item required>
              <Typography className="font-bold text-2xl mb-2">Input Nama Pasien</Typography>
              <Input
                size="large"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" block disabled={!name || !inputValue} size="large">
              Submit
            </Button>
          </Form>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AddObat;
