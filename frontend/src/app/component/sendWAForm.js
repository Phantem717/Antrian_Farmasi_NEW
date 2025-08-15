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
  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [description, setDescription] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [NOP, setNOP] = useState("");
  const socket = getSocket();

  // Fetch patient data when modal opens
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
      
      // Load saved message template if exists
      const savedTemplate = localStorage.getItem(`waTemplate_${location}`);
      if (savedTemplate) {
        setMessageTemplate(savedTemplate);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showError("Gagal memuat data pasien");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setName(patient.patient_name);
    setPhoneNumber(patient.phone_number || "");
    setNOP(patient.NOP || "");
    
    // Auto-fill description if template exists
    if (messageTemplate) {
      const personalizedMessage = messageTemplate
        .replace('{name}', patient.patient_name)
        .replace('{queue}', patient.queue_number);
      setDescription(personalizedMessage);
    }
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      timer: 2000,
    });
  };

  const showSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: message,
      timer: 1500,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Validation
      if (!name || !phoneNumber || !description) {
        throw new Error("Harap lengkapi semua data termasuk pesan");
      }

      if (!phoneNumber.match(/^[0-9]{10,15}$/)) {
        throw new Error("Nomor telepon tidak valid");
      }

      // Prepare payload
      const WAPayload = {
        phone_number: phoneNumber,
        patient_name: name,
        message: description,
        NOP: NOP,
        location: location
      };

      // Save description template if checkbox is checked
      if (saveTemplate) {
        localStorage.setItem(`waTemplate_${location}`, description);
      }

      // Send WA
      const response = await WA_API.sendWACustom(WAPayload);
      
      // Update UI
      showSuccess("Pesan WhatsApp berhasil dikirim");
      socket.emit('update_verif', { location });
      socket.emit('update_display', { location });
      
      // Close and reset
      onClose?.();
      resetForm();
    } catch (error) {
      console.error("Error sending WA:", error);
      showError(error.message || "Gagal mengirim WhatsApp");
    } finally {
      setSending(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setName("");
    setPhoneNumber("");
    setNOP("");
    setDescription("");
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
              value={selectedPatient?.NOP || ""}
              displayEmpty
              onChange={(e) => {
                const patient = data.find(p => p.NOP === e.target.value);
                if (patient) handlePatientSelect(patient);
              }}
              disabled={loading}
              renderValue={(selected) => 
                selectedPatient ? `${selectedPatient.patient_name} - ${selectedPatient.queue_number}` : "Pilih Pasien"
              }
            >
              <MenuItem value="" disabled>
                {loading ? "Memuat data..." : "Pilih Pasien"}
              </MenuItem>
              {data.map((patient) => (
                <MenuItem key={patient.NOP} value={patient.NOP}>
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
            disabled={!!selectedPatient}
          />

          <TextField
            label="Nomor Telepon"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
            type="tel"
            disabled={!!selectedPatient}
          />

          <TextArea
            rows={5}
            placeholder="Isi pesan WhatsApp"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox" 
              id="saveTemplate"
              onChange={(e) => setSaveTemplate(e.target.checked)}
            />
            <label htmlFor="saveTemplate" style={{ marginLeft: 8 }}>
              Simpan template pesan ini
            </label>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!name || !phoneNumber || !description || sending}
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