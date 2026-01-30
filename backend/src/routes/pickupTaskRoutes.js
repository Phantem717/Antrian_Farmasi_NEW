// src/routes/pickupTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createPickupTask,
  getPickupTaskByNOP,
  getAllPickupTasks,
  updatePickupTask,
  deletePickupTask,
  getAllPickupByDate,
  getAllPickupToday
} = require('../controllers/pickupTaskController');

router.post('/', (req, res) => {
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Create a new pickup task'
  // #swagger.description = 'Creates a new pickup task'
  createPickupTask(req, res);});
router.get('/:NOP', (req, res) => {
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Get By NOP'
  // #swagger.description = 'Get By NOP'
  getPickupTaskByNOP(req, res)});
router.get('/', (req, res) => {
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Get All Pickup Tasks'
  // #swagger.description = 'Get All Pickup Tasks'
  getAllPickupTasks(req, res)});
router.put('/:NOP', (req, res) => {
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updatePickupTask(req, res)});
router.delete('/:NOP', (req, res) => {
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Delete By NOP'
  // #swagger.description = 'Delete By NOP'
  deletePickupTask(req, res)});
router.get('/today/now/:category',(req,res)=>{
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Get Today'
  // #swagger.description = 'Get All Task Today'
  getAllPickupToday(req, res);});
router.get('/by-date/:date/:category',(req,res)=>{
  // #swagger.tags = ['Pickup']
  // #swagger.summary = 'Get By Date'
  // #swagger.description = 'Get All Task By Date'
  getAllPickupByDate(req, res);});
module.exports = router;
