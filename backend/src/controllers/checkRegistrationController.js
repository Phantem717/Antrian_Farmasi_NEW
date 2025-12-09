// backend_farmasi\src\controllers\barcodeController.js
const {checkRegistrationInfo,checkRegistrationERM} = require('../services/checkRegistrationInfo');
const {create} = require('../models/apiResponses')
const DoctorAppointments = require('../models/doctorAppointments');
const PharmacyTask = require('../models/pharmacyTask');
const VerificationTask = require('../models/verificationTask'); // Import model baru
const MedicineTask = require('../models/medicineTask');
const PickupTask = require('../models/pickupTask');
const { createPharmacyTask } = require('../controllers/pharmacyTaskController');
const { createVerificationTaskInternal  } = require('./verificationTaskController');
const { getCurrentTimestamp, convertToJakartaTime } = require('../handler/timeHandler');
const {createAntrianFarmasi} = require('../services/createFarmasiQueueService');
const {getAppointment} = require('../controllers/doctorAppointmentsController')
// const io = req.app.get('socketio');
/**
 * Controller untuk mengecek queue berdasarkan NOP.
 * Mengambil NOP dari query parameter.
 */
// Fungsi untuk mendapatkan registration data
const checkRegistration= async (req, res) => {
    console.log("req body",req.params);
  const registrationNo = req.params; // Karena endpoint POST, ambil dari body
    console.log("REG",registrationNo);
  if (!registrationNo) {
    return res.status(400).json({ error: 'registrationNo harus disediakan' });
  }

  try {
    const data = await checkRegistrationInfo(registrationNo.registrationNo);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const checkRegistrationSEP= async (req, res) => {
    console.log("req body",req.params);
  const sepNo = req.params; // Karena endpoint POST, ambil dari body
    console.log("REG",sepNo);
  if (!sepNo) {
    return res.status(400).json({ error: 'SEP harus disediakan' });
  }

  try {
    const data = await checkRegistrationInfo(sepNo.sepNo);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const checkRegistrationERMController = async (req, res) => {
    // ✅ CORRECTION 1: Read data from req.query for GET requests
    console.log("req query", req.query); // It will log req.query now
    const { name, mr_no } = req.query; 

    if (!name || !mr_no) {
        return res.status(400).json({ error: 'NAMA + ERM harus disediakan' });
    }

    try {
        // Assuming checkRegistrationERM calls the external API
        const data = await checkRegistrationERM(name, mr_no);
        console.log("DATA", data);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching registration data:', error);
        // Ensure the error status is 500 if it's a server issue
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = { checkRegistration,checkRegistrationSEP,checkRegistrationERMController};

