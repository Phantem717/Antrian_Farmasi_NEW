// Backend: src/routes/emailRoutes.js (Example using Express)
const express = require('express');
const router = express.Router();
const { sendCertificate } = require('../services/emailService');

router.post('/send-certificate', async (req, res) => {
    try {
        const { email, name, pdfBase64 } = req.body;
        
        // Decode the Base64 PDF data
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');
        
        await sendCertificate(email, name, pdfBuffer);
        
        res.status(200).send({ message: 'Certificate sent successfully!' });
    } catch (error) {
        console.error('Error in certificate sending endpoint:', error);
        res.status(500).send({ message: 'Failed to send certificate.' });
    }
});
module.exports = router;