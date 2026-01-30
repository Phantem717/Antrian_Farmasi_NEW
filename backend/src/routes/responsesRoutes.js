// src/routes/responsesRoutes.js
const express = require('express');
const router = express.Router();
// const controller = require('../controllers/responseController');
// console.log("Controller exports:", controller);

const {
  getAllResponses,
  getMedicineResponses,getPickupResponses,getVerificationResponses
} = require('../controllers/responsesController');

router.get('/:location', (req,res) => {
  // #swagger.tags = ['Responses']
  // #swagger.summary = 'Get All Responses'
  // #swagger.description = 'Get All Responses'
  getAllResponses(req,res)});
router.get('/verify/:location',(req,res)=>{
  // #swagger.tags = ['Responses']
  // #swagger.summary = 'Get Verification Responses'
  // #swagger.description = 'Get Verification Responses'
  getVerificationResponses(req,res)});
router.get('/medicine/:location',(req,res)=>{
  // #swagger.tags = ['Responses']
  // #swagger.summary = 'Get Medicine Responses'
  // #swagger.description = 'Get Medicine Responses'
  getMedicineResponses(req,res)});
router.get('/pickup/:location',(req,res)=>{
  // #swagger.tags = ['Responses']
  // #swagger.summary = 'Get Pickup Responses'
  // #swagger.description = 'Get Pickup Responses'
  getPickupResponses(req,res)});

module.exports = router;
