// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
    getAllLogs
} = require('../controllers/logsController');
    
router.get('/', getAllLogs);


module.exports = router;
