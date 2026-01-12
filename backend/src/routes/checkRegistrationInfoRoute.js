//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const { checkRegistration,checkRegistrationSEP,checkRegistrationERMController} = require('../controllers/checkRegistrationController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.get('/reg_no/:registrationNo', checkRegistration);
router.get('/:sepNo',checkRegistrationSEP)
router.get('/', checkRegistrationERMController)

module.exports = router;
