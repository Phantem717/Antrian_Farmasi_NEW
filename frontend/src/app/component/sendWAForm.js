"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Typography,
  CircularProgress
} from "@mui/material";
import Swal from "sweetalert2";
import { getSocket } from "@/app/utils/api/socket";
import CloseIcon from '@mui/icons-material/Close';
import WA_API from "@/app/utils/api/WA";
import VerificationAPI from "@/app/utils/api/Verification";
import { Input } from 'antd';

const { TextArea } = Input;

export default function SendWAForm({ location, visible, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const socket = getSocket();

  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await VerificationAPI.getVerificationTasksToday(location);
      setData(response.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memuat data",
        text: error.message || "Terjadi kesalahan saat memuat data pasien",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setName(patient.patient_name);
    setPhoneNumber(patient.phone_number || "");
    setType(patient.NOP);
    // Set other fields as needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      if (!name || !phoneNumber) {
        throw new Error("Nama pasien dan nomor telepon harus diisi");
      }

      const WAPayload = {
        phone_number: phoneNumber,
        patient_name: name,
        message: message || "Mohon mengambil obat di loket farmasi"
      };

      const response = await WA_API.sendWAAntrian(WAPayload);
      
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pesan WhatsApp berhasil dikirim",
        timer: 1500,
        showConfirmButton: false,
      });

      onClose?.();
      clearForm();
    } catch (error) {
      console.error("Error sending WA:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim",
        text: error.message || "Terjadi kesalahan saat mengirim WhatsApp",
        timer: 2000,
      });
    } finally {
      setSending(false);
    }
  };

  const clearForm = () => {
    setName("");
    setPhoneNumber("");
    setType("");
    setMessage("");
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

          <Typography variant="h6" component="h2">
            Kirim Pesan WhatsApp
          </Typography>

          <FormControl fullWidth>
            <Select
              value={type}
              displayEmpty
              onChange={(e) => setType(e.target.value)}
              renderValue={(selected) => selected || "Pilih Pasien"}
              disabled={loading}
            >
              <MenuItem value="" disabled>
                {loading ? "Memuat data..." : "Pilih Pasien"}
              </MenuItem>
              {data.map((patient) => (
                <MenuItem 
                  key={patient.NOP} 
                  value={patient.NOP}
                  onClick={() => handlePatientSelect(patient)}
                >
                  {patient.patient_name} - {patient.queue_number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Nama Pasien"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Nomor Telepon"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
            type="tel"
          />

          <TextArea
            rows={4}
            placeholder="Isi pesan (opsional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!name || !phoneNumber || sending}
            fullWidth
            sx={{ mt: 2 }}
          >
            {sending ? (
              <>
                <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                Mengirim...
              </>
            ) : "Kirim WhatsApp"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
}