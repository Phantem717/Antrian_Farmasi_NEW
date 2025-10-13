// Backend: src/services/emailService.js
const nodemailer = require('nodemailer');

// These credentials must come from your secure .env file
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendCertificate(recipientEmail, personName, pdfAttachment) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Sertifikat Pelatihan - ${personName}`,
        text: `Terlampir sertifikat Anda untuk pelatihan ${personName}.`,
        attachments: [{
            filename: `Sertifikat_${personName.replace(/\s/g, '_')}.pdf`,
            content: pdfAttachment,
            contentType: 'application/pdf',
            encoding: 'base64',
        }],
    };

    await transporter.sendMail(mailOptions);
}
module.exports = { sendCertificate };