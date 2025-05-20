//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const {createAntrian} = require('../controllers/createAntrianFarmasiController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.post('/', createAntrian);

module.exports = router;
