//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const {sendWAAntrianController,sendWAPickupController,sendWAProsesController,sendWAVerifController,sendWACustomController} = require('../controllers/WAController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.post('/WA/verif', (req,res)=>{
    // #swagger.tags = ['WA']
    // #swagger.summary = 'Send WA Verif'
    // #swagger.description = 'Send WA Verif'
    sendWAVerifController(req,res);});
router.post('/WA/proses',(req,res)=> {
    // #swagger.tags = ['WA']
    // #swagger.summary = 'Send WA Proses'
    // #swagger.description = 'Send WA Proses'
    sendWAProsesController(req,res);});
router.post('/WA/antrian',(req,res)=> {
    // #swagger.tags = ['WA']
    // #swagger.summary = 'Send WA Antrian'
    // #swagger.description = 'Send WA Antrian'
    sendWAAntrianController(req,res)});
router.post('/WA/pickup',(req,res) => {
    // #swagger.tags = ['WA']
    // #swagger.summary = 'Send WA Pickup'
    // #swagger.description = 'Send WA Pickup'
    sendWAPickupController(req,res)});
router.post('/WA/custom',(req,res)=>{
    // #swagger.tags = ['WA']
    // #swagger.summary = 'Send WA Custom'
        // #swagger.description = 'Send WA Custom'

    sendWACustomController(req,res)});   
module.exports = router;
