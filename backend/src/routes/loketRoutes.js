// src/routes/loketRoutes.js
const express = require('express');
const router = express.Router();

const {
  createLoket,
  getLoketById,
  getAllLokets,
  updateLoket,
  deleteLoket
} = require('../controllers/loketController');

router.post('/',(req,res)=>{

  // #swagger.tags = ['Loket']
  // #swagger.summary = 'Create Loket'
  // #swagger.description = 'Create Loket'
createLoket(req,res);
} );
router.get('/:loket_id', (req,res)=>{
  // #swagger.tags = ['Loket']
  // #swagger.summary = 'Get Loket By Id'
  // #swagger.description = 'Get Loket By Id'
  getLoketById(req,res)} );
router.get('/', (req,res) => {
  // #swagger.tags = ['Loket']
  // #swagger.summary = 'Get All Loket'
  // #swagger.description = 'Get All Loket'
  getAllLokets(req,res)});
router.put('/:loket_id', (req,res)=>{
  // #swagger.tags = ['Loket']
  // #swagger.summary = 'Update Loket'
  // #swagger.description = 'Update Loket'
  
  updateLoket(req,res);
} );
router.delete('/:loket_id', (req,res)=>{
  // #swagger.tags = ['Loket']
  // #swagger.summary = 'Delete Loket'
  // #swagger.description = 'Delete Loket'
  deleteLoket(req,res)});

module.exports = router;
