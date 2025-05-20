//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const { checkQueueController, processQueueAndInsertData, updateBarcodeTask,  getRegistrationData,sendToWAController} = require('../controllers/barcodeController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.get('/barcode/check', checkQueueController);
router.post('/barcode/insert', processQueueAndInsertData);
router.post('/barcode/update/:booking_id', updateBarcodeTask);
router.post('/registration', getRegistrationData);
router.post('/barcode/send',sendToWAController);
module.exports = router;
