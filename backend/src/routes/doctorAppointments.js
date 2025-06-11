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
  updateMedicineType
} = require('../controllers/doctorAppointmentsController');
    
// Endpoint untuk membuat appointment baru
router.get('/antrian', getLatestAntrian);

router.post('/', createAppointment);

// Endpoint untuk mengambil appointment berdasarkan NOP
router.get('/:NOP', getAppointment);

// Endpoint untuk mengambil appointment 
router.get('/', getAllAppointments);


// Endpoint untuk memperbarui appointment berdasarkan NOP
router.put('/:NOP', updateAppointment);
router.put('/type/:NOP',updateMedicineType);
router.patch('/:NOP/status_medicine', updateStatusMedicine);

// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:NOP', deleteAppointment);

module.exports = router;
