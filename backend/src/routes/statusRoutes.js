// src/routes/responsesRoutes.js
const express = require('express');
const authCheck = require('../middleware/authMiddleware.js');
const router = express.Router();
// const controller = require('../controllers/responseController');
// console.log("Controller exports:", controller);

const {
getStatus,getPharmacyNOP,getTimestamp
} = require('../controllers/statusController');

router.post('/',authCheck, (req,res)=> {
    // #swagger.tags = ['Status']
    // #swagger.summary = 'Get Status'
    // #swagger.description = 'Get Status'
    getStatus(req,res)});
router.post('/nop', authCheck, (req,res)=> {
    // #swagger.tags = ['Status']
    // #swagger.summary = 'Get Pharmacy NOP'
    // #swagger.description = 'Get Pharmacy NOP'
    getPharmacyNOP(req,res)});
router.post('/timestamp',authCheck, (req,res) => {
    // #swagger.tags = ['Status']
    // #swagger.summary = 'Get Timestamp'
    // #swagger.description = 'Get Timestamp'
    getTimestamp(req,res)});

module.exports = router;
