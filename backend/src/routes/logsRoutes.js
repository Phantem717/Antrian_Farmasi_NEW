// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
    getAllLogs,
    getTotalMedicineType,
    getAvgServiceTime,
    getDataPerHour,
    getLogsToday,
    getLogsByDate
} = require('../controllers/logsController');
    
router.get('/', getAllLogs);
router.get('/by-date/:date',getLogsByDate);
router.get('/total-medicine',getTotalMedicineType);
router.get('/service-time',getAvgServiceTime);
router.get('/data-per-hour',getDataPerHour);
router.get('/today/now',getLogsToday);
module.exports = router;
