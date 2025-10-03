// src/routes/responsesRoutes.js
const express = require('express');
const authCheck = require('../middleware/authMiddleware.js');
const router = express.Router();
// const controller = require('../controllers/responseController');
// console.log("Controller exports:", controller);

const {
getStatus,getPharmacyNOP,getTimestamp
} = require('../controllers/statusController');

router.post('/',authCheck, getStatus);
router.post('/nop', authCheck, getPharmacyNOP);
router.post('/timestamp',authCheck, getTimestamp);

module.exports = router;
