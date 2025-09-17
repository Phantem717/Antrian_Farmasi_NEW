"use client";
import React, { useState, useEffect, useRef } from "react";
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
import Swal from "sweetalert2";
Swal.mixin({
  zIndex: 2000
});
import { getSocket } from "@/app/utils/api/socket";
import CloseIcon from '@mui/icons-material/Close'; // Add this import
import PrintAntrian from "@/app/utils/api/printAntrian";
import { updateButtonStatus } from "@/app/utils/api/Button";
import BPJSBarcodeAPI from "@/app/utils/api/BPJS_Barcode";
import PickupAPI from "@/app/utils/api/Pickup";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import MedicineAPI from "@/app/utils/api/Medicine";
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";
import CreateAntrianAPI from "@/app/utils/api/createAntrian";
import VerificationAPI from "@/app/utils/api/Verification";
import CheckRegistrationInfo from "@/app/utils/api/checkRegistrationInfo";
export default function BarcodeScanner({location, visible, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
    const [NOP, setNOP] = useState("");
  const [SEP,setSEP] = useState("");
  const [NIK,setNIK] = useState("");
  const [medical_record_no,setMedical_record_no]= useState("");
  const [DOB,setDOB] = useState("");
  const [docter,setDocter] = useState("");
  const [PRB,setPRB] = useState("");
  const isBarcoded = useRef(false);
  const inputRef = useRef(null);
  const isTyped = useRef(false);
  const socket = getSocket();
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  async function clearField(){
    setInputValue("");
    setDOB("");
    setName("");
    setDocter("");
    setMedical_record_no("");
    setNIK("");
    setNOP("");
    setPhoneNumber("");
    setSEP("");
    setType("");
    setPRB("");
  if (inputRef.current) {
    inputRef.current.focus();
  }  
}

  async function validateBarcode(barcode) {
      const cleanedBarcode = barcode.replace(/\s+/g, "");

    if (!cleanedBarcode) {
      Swal.fire({
        icon: "error",
        title: "Barcode kosong",
        text: "Silakan scan barcode terlebih dahulu",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }

    if (cleanedBarcode.length !== 18) {
      Swal.fire({
        icon: "error",
        title: "Data Bukan NOP/SEP",
        text: "Barcode harus diawali dengan NOP atau memiliki panjang 19 karakter",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }

    return true;
  }

  const handleChange = (e) => {
    setType(e.target.value);
    isTyped.current = true;
  };
  async function handleBarcodeEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
const barcode = inputValue.replace(/\s+/g, ""); // Removes ALL whitespace
      
      // Validate before making API call
      if (!await validateBarcode(barcode)) {
        return;
      }

      try {
        const data = await checkRegistration(barcode);
        if (!data) {
          Swal.fire({
            icon: "error",
            title: "Data tidak ditemukan",
            text: "Barcode tidak terdaftar dalam sistem",
            timer: 2000,
            showConfirmButton: false,
          });
        }
        isBarcoded.current = true;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal memeriksa barcode",
          text: error.message || "Terjadi kesalahan saat memeriksa barcode",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  }
  async function insertAll(payload) {
    const appointmentData = {
      sep_no: payload.sep_no,
      queue_number: payload.queue_number,
      queue_status: payload.queue_status,
      queue_type: payload.queue_type,
      patient_name: payload.patient_name,
      medical_record_no: payload.medical_record_no,
      patient_date_of_birth: payload.patient_date_of_birth,
      status_medicine: payload.statusMedicine,
      lokasi: payload.location,
      phone_number: payload.phone_number,
      doctor_name: payload.doctor_name,
      nik: payload.nik,
      farmasi_queue_number: payload.farmasi_queue_number,
      NOP: payload.NOP,
      PRB: payload.PRB
    };

    const pharmacyPayload = {
      NOP: payload.NOP,
      status: "waiting_verification",
      medicine_type: payload.statusMedicine,
      lokasi: payload.location,
    };

    const taskData = {
      NOP: payload.NOP,
      Executor: "-",
      Executor_Names: "-",
      status: null,
      location: location,
    };

  const [doctorAppointment, pharmacyData] = await Promise.all([
  DoctorAppointmentAPI.create(doctorAppointmentData),
  PharmacyAPI.create(pharmacyPayload)
]);
// then verification, since it depends on pharmacy
const verificationData = await createVerificationTaskInternal(
  payload.NOP, "-", "-", "waiting_verification", payload.location
);
    return { doctorAppointment, pharmacyData, verificationData };
  }
  async function checkRegistration(inputValue){
    console.log(inputValue);
   
     const checkRegistrationResponse = await CheckRegistrationInfo.checkQueue(inputValue);
   
      console.log("CHECKRES",checkRegistrationResponse);
      setDocter(checkRegistrationResponse.ParamedicName);
      setNIK(checkRegistrationResponse.SSN);
      setSEP(checkRegistrationResponse.NoSEP);
      setPhoneNumber(checkRegistrationResponse.MobilePhoneNo1);
      setName(checkRegistrationResponse.PatientName);
      setMedical_record_no(checkRegistrationResponse.MedicalNo);
      setDOB(checkRegistrationResponse.DateOfBirth);
      setNOP(checkRegistrationResponse.RegistrationNo);
      setPRB(checkRegistrationResponse.ProlanisPRB);


    return checkRegistrationResponse;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
        if (!inputValue || !type || !docter  || !phoneNumber ||!name ||!medical_record_no ||!DOB ||!NOP ) {
              onClose?.();
          console.log(inputValue,type,docter,NIK,SEP,phoneNumber,name,medical_record_no,DOB,NOP,PRB);
        return Swal.fire({
          icon: "error",
          title: "Input tidak lengkap",
          text: `Mohon lengkapi semua data.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }


     
      const medType = type === "racikan" ? "Racikan" : "Non - Racikan";
      const queueNumber = await CreateAntrianAPI.createAntrian(medType);
      const queueNumberData = queueNumber.data;
      console.log("PREV PAYLOAD",queueNumberData.data.queue_number,medType,name);
      const payload = {
        sep_no: SEP??"-",
        queue_number:queueNumberData.data.queue_number,
        queue_status: "Menunggu",
        queue_type: "Dokter",
        patient_name: name,
        medical_record_no: medical_record_no|| "-",
        patient_date_of_birth: DOB || null,
        statusMedicine: medType,
        location: location,
        phone_number: phoneNumber,
        doctor_name: docter||"-",
        nik: NIK||"-",
        farmasi_queue_number: queueNumberData.data.queue_number,
        NOP: inputValue,
        PRB: PRB || null
      };

      console.log("NEW PAYLOAD",payload);
      await insertAll(payload);
        Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Data berhasil diproses.`,
        timer: 1500,
        showConfirmButton: false,
      });
      onClose?.();
       const WAPayload = {
            phone_number: phoneNumber ?? "-",
            NOP: inputValue ?? "-",
            docter: docter??"-",
            nik: NIK??"-",
            sep: SEP??"-",
            barcode: inputValue ?? "-",
            patient_name: name ?? "-",
            farmasi_queue_number: queueNumberData.data.queue_number ?? "-",
            medicine_type: medType ?? "-",
            
            rm: medical_record_no??"-",
            tanggal_lahir:  new Date(DOB).toISOString().split('T')[0]??"-",
            queue_number: queueNumberData.data.queue_number ?? null,
            prev_queue_number: "-"
        };

           const printPayload = {
            phone_number: phoneNumber ?? "-",
            NOP: inputValue ?? "-",
            doctor_name: docter??"-",
            nik: NIK??"-",
            barcode: inputValue ?? "-",
            patient_name:  name ?? "-",
            farmasi_queue_number: queueNumberData.data.queue_number ?? "-",
            medicine_type: medType ?? "-",
            SEP:  SEP ?? "-",
            tanggal_lahir: new Date(DOB).toISOString().split('T')[0] ?? "-",
            queue_number: queueNumberData.data.queue_number ?? null,
            PRB: PRB,
            switch_WA: localStorage.getItem('waToggleState') || "true",
            lokasi: location
        }
      socket.emit('update_verif',{location});
      socket.emit('update_display',{location});
      const WARESP =await WA_API.sendWAAntrian(WAPayload);
      const PRINTRESP= await PrintAntrian.printAntrian(printPayload);
                  await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

      console.log("RESP ERROR",WARESP.data,PRINTRESP.data)
     


    await clearField();

    } catch (error) {
      console.error("Error saat memproses:", error);
            onClose?.(); // Close modal after success

      Swal.fire({
        icon: "error",
        title: "Gagal Memproses!",
        text: error.message || "Terjadi kesalahan",
        timer: 2000,
        showConfirmButton: false,
      });
      
      await clearField();
    }
  }

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
          {/* Add close button at the top right */}
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

          <Typography variant="h6" textAlign="center" color="black">
            Masukkan Barcode / QR Code
          </Typography>

          <TextField
            inputRef={inputRef}
            label="Scan NOP/SEP"
            variant="outlined"
            fullWidth
            value={inputValue}
           onChange={(e) => setInputValue(e.target.value.replace(/\s+/g, ""))}
    onKeyDown={handleBarcodeEnter} 
          />
          <TextField
            label="Nama"
            variant="outlined"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-readonly
          />

            <TextField
            label="No. Rekam Medis"
            variant="outlined"
            size="small"
            value={medical_record_no}
            onChange={(e) => setMedical_record_no(e.target.value)}
            aria-readonly
          />
            <TextField
            label="Tanggal Lahir"
            variant="outlined"
            size="small"
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            aria-readonly
          />
            <TextField
            label="NIK"
            variant="outlined"
            size="small"
            value={NIK}
            onChange={(e) => setNIK(e.target.value)}
            aria-readonly
          />
          <TextField
            label="No. Telepon"
            variant="outlined"
            size="small"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            aria-readonly
          />
          <TextField
            label="Name Dokter"
            variant="outlined"
            size="small"
            value={docter}
            onChange={(e) => setDocter(e.target.value)}
            aria-readonly
          />
          <TextField
            label="PRB"
            variant="outlined"
            size="small"
            value={PRB}
            onChange={(e) => setPRB(e.target.value)}
            aria-readonly
          />
          <FormControl fullWidth>
            <Select
              value={type}
              displayEmpty
      onChange={handleChange}
            >
              <MenuItem value="">Pilih Jenis Obat</MenuItem>
              <MenuItem value="racikan">Racikan</MenuItem>
              <MenuItem value="nonracikan">Non - Racikan</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" type="submit" color="primary" disabled={isBarcoded.current == false && isTyped.current == false}>
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}