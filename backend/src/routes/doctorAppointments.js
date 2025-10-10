// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/authMiddleware.js');

const {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  updateStatusMedicine,
  getAllAppointments,
  getLatestAntrian,
  updateMedicineType,
  getAllAppointmentsByLocation,
  updatePhoneNumber,
  updateTotalMedicineController
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
router.put('/:NOP/phone_number', updatePhoneNumber);
router.put('/:NOP/total_medicine', authCheck, updateTotalMedicineController);

router.put('/type/:NOP',updateMedicineType);
router.patch('/:NOP/status_medicine', updateStatusMedicine);

// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:NOP', deleteAppointment);
router.get('/:category',getAllAppointmentsByLocation);
module.exports = router;
