// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
    getAllLogs,
    getTotalMedicineType,
    getAvgServiceTime,
    getDataPerHour
} = require('../controllers/logsController');
    
router.get('/', getAllLogs);
router.get('/total-medicine',getTotalMedicineType);
router.get('/service-time',getAvgServiceTime);
router.get('/data-per-hour',getDataPerHour);

module.exports = router;
