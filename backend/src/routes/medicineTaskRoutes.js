// src/routes/medicineTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createMedicineTask,
  getMedicineTaskByNOP,
  getAllMedicineTasks,
  updateMedicineTask,
  deleteMedicineTask,
  getAllMedicineByDate,
  getMedicineToday
} = require('../controllers/medicineTaskController');

router.post('/', (req, res) => {
  // #swagger.tags = ['Medicine']
  // #swagger.summary = 'Create a new medicine task'
  // #swagger.description = 'Creates a new medicine task'

  createMedicineTask(req,res)});
router.get('/:NOP', (req, res) => {
  //#swagger.tags = ['Medicine']
  //#swagger.summary = 'Get By NOP'
  //#swagger.description = 'Get By NOP' 
  getMedicineTaskByNOP(req, res)});
router.get('/', (req, res) => {
  // #swagger.tags = ['Medicine']
  // #swagger.summary = 'Get All Medicine Task'
  // #swagger.description = 'Get All Medicine Task'
  getAllMedicineTasks(req, res)});
router.put('/:NOP', (req,res) => {
  // #swagger.tags = ['Medicine']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updateMedicineTask(req, res)});
router.delete('/:NOP', (req, res) => {
  // #swagger.tags = ['Medicine']
  // #swagger.summary = 'Delete By NOP'
  // #swagger.description = 'Delete By NOP'
  deleteMedicineTask(req, res)});
router.get('/today/now/:category',(req,res) => {
  // #swagger.tags = ['Medicine']
  // #swagger.summary = 'Get Medicine Today'
  // #swagger.description = 'Get Medicine Today'
  getMedicineToday(req, res)});
router.get('/by-date/:date/:category',
  (req,res)=>{
    // #swagger.tags = ['Medicine']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getAllMedicineByDate(req, res);
  }
  );

module.exports = router;
