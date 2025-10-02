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
import Item from "antd/es/list/Item";
import { getSocket } from "@/app/utils/api/socket";
export default function BarcodeScanner({location, visible, onClose,selectedQueue }) {
  const [phoneNumber, setPhoneNumber] = useState(selectedQueue.phone_number);
  const inputRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  async function clearField(){
  
    setPhoneNumber("");
 
  if (inputRef.current) {
    inputRef.current.focus();
  }  
}
  async function handleSubmit(e) {
    e.preventDefault();
    try {
        if (!phoneNumber) {
              onClose?.();
          console.log(phoneNumber);
        return Swal.fire({
          icon: "error",
          title: "Input tidak lengkap",
          text: `Mohon lengkapi semua data.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }

      if(!phoneNumber.startsWith("08")){
          onClose?.();
          console.log(phoneNumber);
        return Swal.fire({
          icon: "error",
          title: "Nomor Telpon Harus Mulai Dengan 08",
          text: `Mohon Ubah Nomor Telpon Sesuai Dengan Struktur Yang Diberikan.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
      const payload = {
      
        phone_number: phoneNumber,
      
      };
      const updateResp = await DoctorAppointmentAPI.updatePhoneNumber(selectedQueue.NOP,phoneNumber);
      console.log("update",updateResp)

      console.log("NEW PAYLOAD",payload);
        Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Data berhasil diproses.`,
        timer: 1500,
        showConfirmButton: false,
      });
      console.log("PAYLOAD",selectedQueue);
      onClose?.();
         const WAPayload = {
            phone_number: phoneNumber ?? "-",
            NOP: selectedQueue.NOP?? "-",
            docter: selectedQueue.doctor_name??"-",
            nik:selectedQueue.NIK??"-",
            sep: selectedQueue.sep_no??"-",
            barcode:selectedQueue.NOP ?? "-",
            patient_name: selectedQueue.patient_name ?? "-",
            farmasi_queue_number: selectedQueue.queue_number ?? "-",
            medicine_type: selectedQueue.medicine_type ?? "-",
            
            rm: selectedQueue.medical_record_no??"-",
            tanggal_lahir:  selectedQueue.patient_date_of_birth??"-",
            queue_number: selectedQueue.queue_number ?? null,
            switch_WA: localStorage.getItem('waToggleState'),
            location: location
        };


              socket.emit('update_pickup',{location});

      const WARESP =await WA_API.sendWAPickup(WAPayload);
                  await new Promise(resolve => setTimeout(resolve, 1000)); // 1-second delay

      console.log("RESP ERROR",WARESP.data)
     


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

       
        
          <TextField
            label="No. Telepon"
            placeholder="Dimulai Dengan 08"
            variant="outlined"
            size="small"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            aria-readonly
            sx={{
                marginTop:"15px"
            }}
          />
      
      
          <Button variant="contained" type="submit" color="primary" >
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}