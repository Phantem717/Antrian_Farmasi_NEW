// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
    getAllLogs,
    getTotalMedicineType,
    getAvgServiceTime,
    getDataPerHour,
    getLogsToday,
    getLogsByDate,
    getByPeriod
} = require('../controllers/logsController');
    
router.get('/', getAllLogs);
router.get('/by-date/:date',getLogsByDate);
router.get('/total-medicine',getTotalMedicineType);
router.get('/service-time',getAvgServiceTime);
router.get('/data-per-hour',getDataPerHour);
router.get('/today/now',getLogsToday);
router.get('/period/:period',getByPeriod);
module.exports = router;
