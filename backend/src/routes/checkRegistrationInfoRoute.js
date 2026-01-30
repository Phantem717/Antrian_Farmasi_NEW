//backend_farmasi\src\routes\BarcodeRoutes.js
const express = require('express');
const router = express.Router();

const { checkRegistration,checkRegistrationSEP,checkRegistrationERMController} = require('../controllers/checkRegistrationController');

// Route untuk mengecek queue
// Endpoint: GET /api/medapp/queue/check?booking_id={id}
router.get('/reg_no/:registrationNo', (req,res)=>{
    // #swagger.tags = ['Check']
    // #swagger.summary = 'Check Registration'
    // #swagger.description = 'Check Registration'
    checkRegistration(req,res)});
router.get('/:sepNo', (req,res)=>{
    // #swagger.tags = ['Check']
    // #swagger.summary = 'Check Registration SEP'
    // #swagger.description = 'Check Registration SEP'
    checkRegistrationSEP(req,res)} )
router.get('/', (req,res)=>{
    // #swagger.tags = ['Check']
    // #swagger.summary = 'Check Registration ERM'
    // #swagger.description = 'Check Registration ERM'
    checkRegistrationERMController(req,res)});

module.exports = router;
