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
    getByPeriod,
    getAvgServiceTimeByDate,
    getDataPerHourByDate,
    getTotalMedicineTypeByDate
    
} = require('../controllers/logsController');
    
router.get('/', getAllLogs);
router.get('/by-date/:date/:category',getLogsByDate);
router.get('/service-time/:fromDate/:toDate/:category',getAvgServiceTimeByDate);
router.get('/data-per-hour/:fromDate/:toDate/:category',getDataPerHourByDate);
router.get('/total-medicine/:fromDate/:toDate/:category',getTotalMedicineTypeByDate);
router.get('/total-medicine/:category',getTotalMedicineType);
router.get('/service-time/:category',getAvgServiceTime);
router.get('/data-per-hour/:category',getDataPerHour);
router.get('/today/now/:category',getLogsToday);
router.get('/period/:period/:category',getByPeriod);
module.exports = router;
