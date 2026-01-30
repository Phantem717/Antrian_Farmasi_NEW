//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const {createAntrian,createAntrianGMCB} = require('../controllers/createAntrianFarmasiController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.post('/GMCB', (req,res)=> {
    // #swagger.tags = ['Queue']
    // #swagger.summary = 'Create Antrian GMCB'
    // #swagger.description = 'Create Antrian GMCB'
    createAntrianGMCB(req,res)});

router.post('/:medicineType/:lokasi',(req,res)=>{
    // #swagger.tags = ['Queue']
    // #swagger.summary = 'Create Antrian'
    // #swagger.description = 'Create Antrian'
    createAntrian(req,res)} );

module.exports = router;
