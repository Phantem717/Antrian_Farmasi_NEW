// src/routes/responsesRoutes.js
const express = require('express');
const router = express.Router();
// const controller = require('../controllers/responseController');
// console.log("Controller exports:", controller);

const {
  getAllResponses,
  getMedicineResponses,getPickupResponses,getVerificationResponses
} = require('../controllers/responsesController');

router.get('/:location', getAllResponses);
router.get('/verify/:location',getVerificationResponses);
router.get('/medicine/:location',getMedicineResponses);
router.get('/pickup/:location',getPickupResponses);

module.exports = router;
