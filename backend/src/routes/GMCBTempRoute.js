// src/routes/doctorAppointments.js
const express = require('express');
const authCheck = require('../middleware/authMiddleware.js');
const router = express.Router();
const  {
    updateAntrian,
    getAppointment,
    getAllAppointments,
    getFarmasiList,
    deleteAppointment,
    getLatestAntrian,
    getAllAppointmentsByLocation,
    createAppointment,
    verifyTempQueue
 
   
} = require('../controllers/GMCBTempController')
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

// Endpoint untuk membuat appointment baru
router.post('/', (req,res) =>{
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Create a new appointment'
    // #swagger.description = 'Creates a new appointment'
    createAppointment(req,res)});
router.get('/', (req,res) => {
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Get All Appointment'
    // #swagger.description = 'Get All Appointment'
    getAllAppointments(req,res)} );

router.post('/get-list',authenticate, (req,res)=>{
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Get Farmasi List'
    // #swagger.description = 'Get Farmasi List'
    getFarmasiList(req,res)} );

router.get('/antrian', (req,res)=>{
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Get Antrian'
    // #swagger.description = 'Get Antrian'
    getLatestAntrian(req,res)} );


// Endpoint untuk mengambil appointment berdasarkan NOP
router.get('/:id', (req,res) => { 
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Get By NOP'
    // #swagger.description = 'Get By NOP'
    getAppointment(req,res)});

// Endpoint untuk mengambil appointment 


// Endpoint untuk memperbarui appointment berdasarkan NOP
// router.put('/:NOP', updateAppointment);
router.patch('/update', (req,res) => {
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Update By NOP'
    // #swagger.description = 'Update By NOP'
    updateAntrian(req,res)});
// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:id', (req,res)=>{
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Delete By NOP'
    // #swagger.description = 'Delete By NOP'
    deleteAppointment(req,res)});
router.get('/:category',(req, res) => {
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Get By Category'
    // #swagger.description = 'Get By Category'
    getAllAppointmentsByLocation(req,res)});
router.post('/verify',(req,res)=>{
    // #swagger.tags = ['GMCB TEMP']
    // #swagger.summary = 'Verify Temp Queue'
    // #swagger.description = 'Verify Temp Queue'
    verifyTempQueue(req,res)});
module.exports = router;
