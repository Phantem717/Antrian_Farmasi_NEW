// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  updateStatusMedicine,
  getAllAppointments,
  getLatestAntrian,
} = require('../controllers/doctorAppointmentsController');
    
// Endpoint untuk membuat appointment baru
router.get('/antrian', getLatestAntrian);

router.post('/', createAppointment);

// Endpoint untuk mengambil appointment berdasarkan bookingId
router.get('/:bookingId', getAppointment);

// Endpoint untuk mengambil appointment 
router.get('/', getAllAppointments);


// Endpoint untuk memperbarui appointment berdasarkan bookingId
router.put('/:bookingId', updateAppointment);
router.patch('/:bookingId/status_medicine', updateStatusMedicine);

// Endpoint untuk menghapus appointment berdasarkan bookingId
router.delete('/:bookingId', deleteAppointment);

module.exports = router;
