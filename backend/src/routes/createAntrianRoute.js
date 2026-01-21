//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const {createAntrian,createAntrianGMCB} = require('../controllers/createAntrianFarmasiController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.post('/GMCB', createAntrianGMCB);

router.post('/:medicineType/:lokasi', createAntrian);

module.exports = router;
