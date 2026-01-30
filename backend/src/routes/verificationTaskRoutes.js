// src/routes/verificationTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createVerificationTask,
  getVerificationTaskByNOP,
  getAllVerificationTasks,
  updateVerificationTask,
  deleteVerificationTask,
  getVerificationToday,
  getVerificationDate
} = require('../controllers/verificationTaskController');

router.post('/', (req, res) => {
  // swagger
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Create a new verification task'
  // #swagger.description = 'Creates a new verification task'
  createVerificationTask(req, res)} );
router.get('/:NOP', (req, res)=> {
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Get By NOP'
  // #swagger.description = 'Get By NOP'
  getVerificationTaskByNOP(req, res);
} );
router.get('/', (req, res) => {
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Get All Verification Task'
  // #swagger.description = 'Get All Verification Task'
  getAllVerificationTasks(req, res)});

router.put('/:NOP', (req, res) => {
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updateVerificationTask(req, res)});
router.delete('/:NOP', (req, res)=> {
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Delete'
  // #swagger.description = 'Delete Verification Task By NOP'
  deleteVerificationTask(req, res)} );
router.get('/now/today/:category',(req, res) => {
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Get Verification Today'
  // #swagger.description = 'Get Verification Today'

  getVerificationToday(req, res)});
router.get('/by-date/:date/:category',(req, res) => {
  // #swagger.tags = ['Verification']
  // #swagger.summary = 'Get By Date'
  // #swagger.description = 'Get All Task By Date'
  getVerificationDate});

module.exports = router;
