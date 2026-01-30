// src/routes/ButtonRoutes.js
const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/loginController');

// Route untuk update status pada Pharmacy_Task dan Verification_Task
// booking_id dikirim sebagai parameter URL
router.post('/',(req,res) => {
    // #swagger.tags = ['Login']
    // #swagger.summary = 'Login'
    // #swagger.description = 'Login'
    LoginController.checkLoginController(req,res);
} );

module.exports = router;
