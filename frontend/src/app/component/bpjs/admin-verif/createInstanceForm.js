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

export default function BarcodeScanner({ visible, onClose }) {
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

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
      location: "Lantai 1 BPJS",
    };

    const [doctorAppointment,  pharmacyData, verificationData] = await Promise.all([
      DoctorAppointmentAPI.createAppointment(appointmentData),
      PharmacyAPI.createPharmacyTask(pharmacyPayload),
            VerificationAPI.createVerificationTask(taskData),

    ]);

    return { doctorAppointment, pharmacyData, verificationData };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!type || !inputValue || !name || !phoneNumber) {
              onClose?.();

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
        sep_no: "-",
        queue_number:queueNumberData.data.queue_number,
        queue_status: "Menunggu",
        queue_type: "Dokter",
        patient_name: name,
        medical_record_no: "-",
        patient_date_of_birth: null,
        statusMedicine: medType,
        location: "Lantai 1 BPJS",
        phone_number: phoneNumber,
        doctor_name: "-",
        nik: "-",
        farmasi_queue_number: queueNumberData.data.queue_number,
        NOP: inputValue,
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
            docter: "-",
            nik: "-",
            sep: "-",
            barcode: inputValue ?? "-",
            patient_name: name ?? "-",
            farmasi_queue_number: queueNumberData.data.queue_number ?? "-",
            medicine_type: medType ?? "-",
            sep:  "-",
            rm: "-",
            tanggal_lahir:  "-",
            queue_number: queueNumberData.data.queue_number ?? null,
        };

           const printPayload = {
            phone_number: phoneNumber ?? "-",
            NOP: inputValue ?? "-",
            docter: "-",
            nik: "-",
            sep: "-",
            barcode: inputValue ?? "-",
            patient_name: name ?? "-",
            farmasi_queue_number: queueNumberData.data.queue_number ?? "-",
            medicine_type: medType ?? "-",
            SEP:  "-",
            tanggal_lahir:  "-",
            queue_number: queueNumberData.data.queue_number ?? null,
        }

      const WARESP =await WA_API.sendWAAntrian(WAPayload);
      const PRINTRESP= await PrintAntrian.printAntrian(printPayload);

      console.log("RESP ERROR",WARESP.data,PRINTRESP.data)
     


    

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

          <Typography variant="h6" textAlign="center">
            Masukkan Barcode / QR Code
          </Typography>

          <TextField
            inputRef={inputRef}
            label="Scan Booking ID"
            variant="outlined"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent auto-submit
    }
  }}
          />
          <TextField
            label="Nama"
            variant="outlined"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="No. Telepon"
            variant="outlined"
            size="small"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <FormControl fullWidth>
            <Select
              value={type}
              displayEmpty
              onChange={(e) => setType(e.target.value)}
            >
              <MenuItem value="">Pilih Jenis Obat</MenuItem>
              <MenuItem value="racikan">Racikan</MenuItem>
              <MenuItem value="nonracikan">Non - Racikan</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" type="submit" color="primary">
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}