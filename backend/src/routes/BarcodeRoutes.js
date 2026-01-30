//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const { checkQueueController, processQueueAndInsertData, updateBarcodeTask,  getRegistrationData,sendToWAController} = require('../controllers/barcodeController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.get('/barcode/check', (req, res) => {
    // #swagger.tags = ['Barcode']
    // #swagger.summary = 'Check Queue'
    // #swagger.description = 'Check Queue'
    checkQueueController(req, res)});
router.post('/barcode/insert', (req,res)=>{ 
    // #swagger.tags = ['Barcode']
    // #swagger.summary = 'Process Queue and Insert Data'
    // #swagger.description = 'Process Queue and Insert Data'
    processQueueAndInsertData(req,res)});
router.post('/barcode/update/:NOP', (req,res)=> { 
    // #swagger.tags = ['Barcode']
    // #swagger.summary = 'Update Barcode Task'
    // #swagger.description = 'Update Barcode Task'

    updateBarcodeTask(req,res)});
router.post('/registration',(req,res)=> {
    // #swagger.tags = ['Barcode']
    // #swagger.summary = 'Get Registration Data'
    // #swagger.description = 'Get Registration Data'
    getRegistrationData(req,res)});
router.post('/barcode/send',(req,res)=>{
    // #swagger.tags = ['Barcode']
    // #swagger.summary = 'Send To WA'
    // #swagger.description = 'Send To WA'
    sendToWAController(req,res)});

module.exports = router;
