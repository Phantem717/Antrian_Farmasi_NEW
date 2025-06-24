//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const { checkRegistration,checkRegistrationSEP} = require('../controllers/checkRegistrationController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.get('/:registrationNo', checkRegistration);
router.get('/:sepNo',checkRegistrationSEP)

module.exports = router;
