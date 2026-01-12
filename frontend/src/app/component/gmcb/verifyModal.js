"use client";
import Swal from "sweetalert2";
import React, { useState, useRef } from "react";
import { Layout, Input, Form } from "antd";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Modal,
  Backdrop,
  Fade,
  IconButton 
} from "@mui/material";
import Header from "@/app/component/Header";
import MovingText from "@/app/component/bpjs/admin-verif/Movingtext_v";
import Sidebar from "@/app/component/Sidebar-b";
// import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import GMCBAppointmentAPI from "@/app/utils/api/GMCB_Appointment";
import CheckRegistrationAPI from "@/app/utils/api/checkRegistrationInfo";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import VerificationAPI from "@/app/utils/api/Verification";
import WA_API from "@/app/utils/api/WA";
import CreateAntrianAPI from "@/app/utils/api/createAntrian";
import PrintAntrian from "@/app/utils/api/printAntrian";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode";
import { getSocket } from "@/app/utils/api/socket";
import CloseIcon from '@mui/icons-material/Close';
import GMCBTempAPI from "@/app/utils/api/GMCB_Temp";
// ✅ Fixed: Added props destructuring
const VerifyModal = ({selectedQueue = [], visible, onClose, location }) => {
  const { Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const siderWidth = collapsed ? 80 : 300;
  const socket = getSocket();
  const [name, setName] = useState("");
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef(null);
    console.log("VIS",visible);
  async function clearField() {
    setInputValue("");
    setName("");
    if (inputRef.current) inputRef.current.focus();
  }

  async function insertAll(payload) {
    console.log("PAYLOAD", payload);

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
      doctor_name: payload.ParamedicName  || "-",
      nik: payload.nik  || "-",
      NOP: payload.NOP  || "-",
      isPaid: payload.isPaid  || "-",
      payment_type: payload.payment_type  || "-",
      location_from: payload.location_from  || "-",
      total_medicine: payload.total_medicine  || "-",
      poliklinik: payload.poliklinik  || "-",
    };

    console.log("APPOINTMENT DATA", appointmentData)
    console.log("QUEUE", selectedQueue);

    const verifyResp = await GMCBTempAPI.verifyTemp(selectedQueue[0],appointmentData)

    return { verifyResp };
  }

  // ✅ Fixed: Changed to normal function to prevent form submission issues
  const handleSubmit = async (e) => {
    // ✅ Prevent default form submission
    if (e) e.preventDefault();
    
    try {
      if (!inputValue || !name) {
        return Swal.fire("❌", "Mohon lengkapi semua data.", "error");
      }

      const response = await CheckRegistrationAPI.checkQueueERM(name, inputValue);
      const dataNOP = response.data[0];

      const data = await CheckRegistrationAPI.checkQueue(dataNOP.RegistrationNo);
      console.log("RESPONSE", response, data);
      

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
          
          // ✅ Fixed comparison
          if (selectedLokasi === 'gmcb') {
            selectedLokasi = "Lantai 1 GMCB";
            apiLokasi = "farmasi-gmcb-lt1";
          } else {
            selectedLokasi = "Lantai 3 GMCB";
            apiLokasi = "farmasi-gmcb-lt3";
          }
          
          try {
            // 1. Get Medicine Type Info
            const med_type_resp = await BPJSBarcodeAPI.fetchRegistrationInfo(data.RegistrationNo);
            
            // ✅ Fixed comparison operator
            let med_type_local = (med_type_resp.message === "Tidak ada racikan") ? "Non - Racikan" : "Racikan";
            let total_medicine = med_type_resp.data.length;
                const origin = data.ServiceUnitName;
            // 3. Create Queue and get queue number
            const create_antrian_resp = await CreateAntrianAPI.createAntrianGMCB(med_type_local, apiLokasi,origin);
            const queueData = create_antrian_resp.data;
            const queueNumber_local = queueData.data.queue_number;
            console.log("QUEUE", queueData, queueNumber_local);
            

            // 5. Build payload using LOCAL/IMMEDIATE variables
            const payload = {
              queue_status: "Menunggu",
              NOP: data.RegistrationNo,
              patient_name: data.PatientName,
              patient_date_of_birth: data.DateOfBirth,
              nik: data.SSN,
              medical_record_no: data.MedicalNo,
              phone_number: data.MobilePhoneNo1,
              doctor_name: data.doctor_name,
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

            

            return payload;
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
            
            // ✅ Fixed: Use resultData.location instead of undefined 'location'
            const WAPayload = {
              phone_number: resultData.phone_number ?? "-",
              NOP: resultData.NOP ?? "-",
              docter: resultData.doctor_name ?? "-",
              nik: resultData.nik ?? "-",
              sep: "-",
              barcode: resultData.NOP ?? "-",
              patient_name: resultData.patient_name ?? "-",
              farmasi_queue_number: resultData.queue_number ?? "-",
              medicine_type: resultData.status_medicine ?? "-",
              rm: resultData.medical_record_no ?? "-",
              tanggal_lahir: new Date(resultData.patient_date_of_birth).toISOString().split('T')[0] ?? "-",
              queue_number: resultData.queue_number ?? null,
              prev_queue_number: "-",
              location: resultData.location // ✅ Fixed
            };

            const printPayload = {
              phone_number: resultData.phone_number ?? "-",
              NOP: resultData.NOP ?? "-",
              docter: resultData.doctor_name ?? "-",
              nik: resultData.nik ?? "-",
              barcode: resultData.NOP ?? "-",
              patient_name: resultData.patient_name ?? "-",
              farmasi_queue_number: resultData.queue_number ?? "-",
              medicine_type: resultData.status_medicine ?? "-",
              SEP: "-",
              tanggal_lahir: new Date(resultData.patient_date_of_birth).toISOString().split('T')[0] ?? "-",
              queue_number: resultData.queue_number ?? null,
              PRB: resultData.PRB,
              switch_WA: localStorage.getItem('waToggleState') || "true",
              lokasi: resultData.location // ✅ Fixed
            };
            
            await insertAll(resultData);
            // const print_wa = await Promise.all([
            //   WA_API.sendWAAntrian(WAPayload),
            //   PrintAntrian.printAntrian(printPayload)
            // ]);
            // console.log("PRINT_WA", print_wa);
            
            Swal.fire("Success!", "Data berhasil disimpan", "success");

            // ✅ Fixed: Use resultData.location
            socket.emit('update_verif', { location: resultData.location });
            socket.emit('update_display', { location: resultData.location });
            
            // ✅ Clear fields and close modal after success
            clearField();
            onClose();

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
  };

  return (
    <Modal
      open={visible}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 300 }}
    >
      <Fade in={visible}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Form
            layout="vertical"
            style={{
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

            {/* ✅ Fixed: Changed to use onClick instead of htmlType submit */}
            <Button 
              variant="contained"
              onClick={handleSubmit}
              disabled={!name || !inputValue} 
              fullWidth
              size="large"
            >
              Submit
            </Button>
          </Form>
        </Box>
      </Fade>
    </Modal>
  );
};

export default VerifyModal;