// src/routes/doctorAppointments.js
const express = require('express');
const authCheck = require('../middleware/authMiddleware.js');
const router = express.Router();
const  {
    createAppointment,
    getAppointment,
    getAllAppointments,
    updateStatusMedicine,
    updateGMCBAppointmentController,
    deleteAppointment,
    getLatestAntrian,
    updateMedicineType,
    getAllAppointmentsByLocation,
    updateTotalMedicineController,
    getDoctorTotalByDate,
updateAppointment,
    RouteUpdateDoubleController,
    updatePhoneNumber,
    updatePaymentStatus
   
} = require('../controllers/GMCBController')
const authenticate = (req,res,next) => {
    try {
        const consId = req.headers['x-cons-id'];
        const timestamp = req.headers['x-timestamp'];
        const signature = req.headers['x-signature'];
    
        if(!consId || !timestamp || !signature){
            return res.status(401).json({error: "Invalid/Incomplete Headers"});
        }
    
        next();
    } catch (error) {
        console.error("AUthentication Error", error);
        return res.status(500).json({ error: "Internal authentication error" });

    }
   
}
const {
  getFarmasiList
} = require('../controllers/retrieveGMCBAntrianListController');
    
// Endpoint untuk membuat appointment baru
router.post('/', (req,res)=>{
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Create a new appointment'
    // #swagger.description = 'Creates a new appointment'
    createAppointment(req,res)} );
router.get('/', (req,res)=> {
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Get All Appointment'
    // #swagger.description = 'Get All Appointment'
    getAllAppointments(req,res)});

router.post('/get-list',authenticate, (req,res)=>{
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Get Farmasi List'
    // #swagger.description = 'Get Farmasi List'
    getFarmasiList(req,res)} );
router.get('/antrian', (req,res)=> { 
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Get Antrian'
    // #swagger.description = 'Get Antrian'
    getLatestAntrian(req,res)});


// Endpoint untuk mengambil appointment berdasarkan NOP
router.get('/:NOP',(req,res)=> {
    
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Get By NOP'
    // #swagger.description = 'Get By NOP'
    getAppointment(req,res)});

// Endpoint untuk mengambil appointment 


// Endpoint untuk memperbarui appointment berdasarkan NOP
// router.put('/:NOP', updateAppointment);
router.put('/:NOP/phone_number',(req,res)=> {
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Update By NOP'
    // #swagger.description = 'Update By NOP'
    updatePhoneNumber(req,res)});
router.patch('/update_status/:NOP', (req,res) => {
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Update By NOP'
    // #swagger.description = 'Update By NOP'
    updatePaymentStatus(req,res)});
router.patch('/update/:NOP', (req,res) => {
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Update By NOP'
    // #swagger.description = 'Update By NOP'
    updateGMCBAppointmentController(req,res)});

router.patch('/total_medicine', authCheck, (req,res)=>{
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Update total medicine by NOP'
    // #swagger.description = 'Update total medicine by NOP'
    updateTotalMedicineController(req,res)});

router.put('/type/:NOP',(req,res) =>{
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Update By NOP'
    // #swagger.description = 'Update By NOP'
    updateMedicineType(req,res)});
router.patch('/:NOP/status_medicine', (req,res) => {
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Update By NOP'
    // #swagger.description = 'Update By NOP'
    updateStatusMedicine(req,res)});
router.get('/by-date/:date/:category',(req,res)=>{
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getDoctorTotalByDate(req,res)});
// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:NOP', (req,res) => {
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Delete By NOP'
    // #swagger.description = 'Delete By NOP'
    deleteAppointment(req,res)});
router.get('/:category',(req,res)=>{
    // #swagger.tags = ['GMCB']
    // #swagger.summary = 'Get By Category'
    // #swagger.description = 'Get By Category'
    getAllAppointmentsByLocation(req,res)});

module.exports = router;
