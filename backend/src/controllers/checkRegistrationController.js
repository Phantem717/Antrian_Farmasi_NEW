// backend_farmasi\src\controllers\barcodeController.js
const {checkRegistrationInfo} = require('../services/checkRegistrationInfo');
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




module.exports = { checkRegistration,checkRegistrationSEP};

