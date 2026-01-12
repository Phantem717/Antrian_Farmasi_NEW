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
router.post('/', createAppointment);
router.get('/', getAllAppointments);

router.post('/get-list',authenticate, getFarmasiList);
router.get('/antrian', getLatestAntrian);


// Endpoint untuk mengambil appointment berdasarkan NOP
router.get('/:NOP', getAppointment);

// Endpoint untuk mengambil appointment 


// Endpoint untuk memperbarui appointment berdasarkan NOP
// router.put('/:NOP', updateAppointment);
router.put('/:NOP/phone_number', updatePhoneNumber);
router.patch('/update_status/:NOP', updatePaymentStatus);
router.patch('/update/:NOP', updateGMCBAppointmentController);

router.patch('/total_medicine', authCheck, updateTotalMedicineController);

router.put('/type/:NOP',updateMedicineType);
router.patch('/:NOP/status_medicine', updateStatusMedicine);
router.get('/by-date/:date/:category',getDoctorTotalByDate);
// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:NOP', deleteAppointment);
router.get('/:category',getAllAppointmentsByLocation);

module.exports = router;
