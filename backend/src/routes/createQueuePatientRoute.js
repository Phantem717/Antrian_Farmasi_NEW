//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const {createQueuePatient} = require('../controllers/createQueuePatientController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.post('/:type',  createQueuePatient);

module.exports = router;
