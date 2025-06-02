// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
  createApiResponse
} = require('../controllers/apiResponseController');
    
// Endpoint untuk membuat appointment baru

router.post('/', createApiResponse);


module.exports = router;
