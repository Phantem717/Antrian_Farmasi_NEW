// src/routes/ButtonRoutes.js
const express = require('express');
const router = express.Router();
const ButtonController = require('../controllers/buttonController');

// Route untuk update status pada Pharmacy_Task dan Verification_Task
// booking_id dikirim sebagai parameter URL
router.post('/update/medicine-type', ButtonController.updateStatusMedicineType);

module.exports = router;
