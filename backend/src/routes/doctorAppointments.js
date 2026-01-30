// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/authMiddleware.js');

const {
  createAppointment,
  getAppointment,
  updateAppointment,
  getDoctorTotalByDate,
  deleteAppointment,
  updateStatusMedicine,
  getAllAppointments,
  getLatestAntrian,
  updateMedicineType,
  getAllAppointmentsByLocation,
  updatePhoneNumber,
  updateTotalMedicineController,
  updateDoctorAppointmentController,
  RouteUpdateDoubleController
} = require('../controllers/doctorAppointmentsController');
    
// Endpoint untuk membuat appointment baru
router.get('/antrian', (req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Get Antrian'
  // #swagger.description = 'Get Antrian'
  getLatestAntrian(req, res)});

router.post('/', (req, res)=>{
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Create a new appointment'
  // #swagger.description = 'Creates a new appointment'
  createAppointment(req, res)});

// Endpoint untuk mengambil appointment berdasarkan NOP
router.get('/:NOP',(req, res)=>{
  
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Get By NOP'
  // #swagger.description = 'Get By NOP'

  getAppointment(req, res)} );

// Endpoint untuk mengambil appointment 
router.get('/', (req,res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Get All Appointment'
  // #swagger.description = 'Get All Appointment'
  getAllAppointments(req, res)});


// Endpoint untuk memperbarui appointment berdasarkan NOP
// router.put('/:NOP', updateAppointment);
router.put('/:NOP/phone_number',(req, res)=>{
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updatePhoneNumber(req, res)} );
router.patch('/update/:NOP', (req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updateDoctorAppointmentController(req, res)});

router.patch('/total_medicine',
  authCheck,  // Auth middleware runs first
  (req, res) => {
    // #swagger.tags = ['Doctor Appointments']
    // #swagger.summary = 'Update total medicine by NOP'
    updateTotalMedicineController(req, res);
  }
);
router.put('/type/:NOP',(req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updateMedicineType(req, res)});
router.patch('/:NOP/status_medicine', (req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Update By NOP'
  // #swagger.description = 'Update By NOP'
  updateStatusMedicine(req, res)});
router.get('/by-date/:date/:category',(req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Get By Date'
  // #swagger.description = 'Get All Task By Date'
  getDoctorTotalByDate(req, res)});
// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:NOP', (req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Delete By NOP'
  // #swagger.description = 'Delete By NOP'
  deleteAppointment(req, res)});
router.get('/:category',(req, res) => {
  // #swagger.tags = ['Doctor Appointments']
  // #swagger.summary = 'Get By Category'
  // #swagger.description = 'Get By Category'
  getAllAppointmentsByLocation(req, res)});
module.exports = router;
