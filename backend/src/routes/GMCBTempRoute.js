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
router.post('/', createAppointment);
router.get('/', getAllAppointments);

router.post('/get-list',authenticate, getFarmasiList);
router.get('/antrian', getLatestAntrian);


// Endpoint untuk mengambil appointment berdasarkan NOP
router.get('/:id', getAppointment);

// Endpoint untuk mengambil appointment 


// Endpoint untuk memperbarui appointment berdasarkan NOP
// router.put('/:NOP', updateAppointment);
router.patch('/update', updateAntrian);
// Endpoint untuk menghapus appointment berdasarkan NOP
router.delete('/:id', deleteAppointment);
router.get('/:category',getAllAppointmentsByLocation);
router.post('/verify',verifyTempQueue);
module.exports = router;
