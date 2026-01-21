// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

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
} = require('../controllers/retrieveFarmasiListController');
    
// Endpoint untuk membuat appointment baru

router.post('/',authenticate, getFarmasiList);


module.exports = router;
