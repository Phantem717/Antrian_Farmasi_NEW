//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const {sendWAAntrianController,sendWAPickupController,sendWAProsesController,sendWAVerifController} = require('../controllers/WAController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.post('/WA/verif', sendWAVerifController);
router.post('/WA/proses', sendWAProsesController);
router.post('/WA/antrian', sendWAAntrianController);
router.post('/WA/pickup',sendWAPickupController);
module.exports = router;
