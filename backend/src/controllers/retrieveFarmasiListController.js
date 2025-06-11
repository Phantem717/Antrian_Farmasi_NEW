const VerificationTask = require('../models/verificationTask');
const MedicineTask = require('../models/medicineTask');
const DoctorAppointment = require('../models/doctorAppointments');
const PharmacyTask = require('../models/pharmacyTask');
const sendWA = require('../services/sendWAService');
const { checkQueue, fetchRegistrationData, sendToWA } = require('../services/BarcodeService');
const { getCurrentTimestamp, convertToJakartaTime } = require('../handler/timeHandler');
const { createAntrianFarmasi } = require('../services/createFarmasiQueueService');
const { createVerificationTaskInternal } = require('./verificationTaskController');
const { printAntrianFarmasi } = require('../services/printAntrianService');

function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;
  
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Replace leading 62 or +62 with 0
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(2);
  }
  console.log("CLEANED",cleaned);
  return cleaned;
}

async function insertAll(payload) {
  const doctorAppointmentData = {
    sep_no: payload.sep_no || null,
    queue_number: payload.queue_number || null,
    queue_status: payload.queue_status || null,
    queue_type: payload.queue_type || null,
    patient_name: payload.patient_name || null,
    medical_record_no: payload.medical_record_no || null,
    patient_date_of_birth: payload.patient_date_of_birth || null,
    status_medicine: payload.statusMedicine,
    lokasi: payload.location || null,
    phone_number: payload.phone_number|| "-",
    doctor_name: payload.doctor_name || "-",
    nik: payload.nik || "-",
    farmasi_queue_number: payload.farmasi_queue_number || "-",
    NOP: payload.NOP || "-",
  };

  const pharmacyPayload = {
    NOP: payload.NOP,
    status: "waiting_verification",
    medicine_type: payload.statusMedicine,
    lokasi: payload.location
  };

  let [doctorAppointment, verificationData, pharmacyData] = await Promise.all([
    DoctorAppointment.create(doctorAppointmentData),
    createVerificationTaskInternal(payload.NOP, "-", "-", "waiting_verification", payload.location),
    PharmacyTask.create(pharmacyPayload)
  ]);

  return { doctorAppointment, pharmacyData, verificationData };
}

const getFarmasiList = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body Is Empty" });
    }

    const farmasiArray = req.body;
    const NOP = farmasiArray.payload.NOP;
    
    if (!NOP) {
      return res.status(400).json({ message: "NOP NOT FOUND" });
    }

    let statusMedicine = "";
    if (farmasiArray.payload.statusMedicine == "racikan") {
      statusMedicine = "Racikan";
    }
    if (farmasiArray.payload.statusMedicine == "nonracikan") {
      statusMedicine = "Non - Racikan";
    }

    let [existingDoctorAppointment, existingPharmacyTask, existingVerificationTask] = await Promise.all([
      DoctorAppointment.findByNOP(NOP),
      PharmacyTask.findByNOP(NOP),
      VerificationTask.findByNOP(NOP)
    ]);

    let result = {};
    let payload = {};

    if (!existingDoctorAppointment && !existingPharmacyTask && !existingVerificationTask) {
      payload = {
        sep_no: farmasiArray.payload.sep_no ?? null,
        queue_number: farmasiArray.payload.farmasi_queue_number ?? null,
        queue_status: farmasiArray.payload.queue_status ?? "Menunggu",
        queue_type: farmasiArray.payload.queue_type ?? "Dokter",
        patient_name: farmasiArray.payload.patient_name ?? null,
        medical_record_no: farmasiArray.payload.medical_record_no ?? null,
        patient_date_of_birth: farmasiArray.payload?.patient_date_of_birth ?? null,
        statusMedicine: statusMedicine,
        location: "Lantai 1 BPJS",
        phone_number: farmasiArray.payload.phone_number ?? null,
        doctor_name: farmasiArray.payload.doctor_name ?? null,
        nik: farmasiArray.payload.nik ?? "-",
        farmasi_queue_number: farmasiArray.payload.farmasi_queue_number ?? "-",
        NOP: farmasiArray.payload.NOP ?? null,
      };

      result = await insertAll(payload);
      existingDoctorAppointment = result.doctorAppointment;
      existingPharmacyTask = result.pharmacyData;
      existingVerificationTask = result.verificationData;

      const WAPayload = {
        sep: farmasiArray.payload.sep_no ?? "-",
        patient_name: farmasiArray.payload.patient_name ?? "-",
        rm: farmasiArray.payload.medical_record_no ?? "-",
        nik: farmasiArray.payload.nik ?? "-",
        docter: farmasiArray.payload.doctor_name ?? "-",
        phone_number: farmasiArray.payload.phone_number ?? "-",
        medicine_type: statusMedicine ?? "-"
      };

      const printPayload = {
        phone_number: farmasiArray.payload.phone_number ?? "-",
        barcode: farmasiArray.payload.NOP ?? "-",
        patient_name: farmasiArray.payload.patient_name ?? "-",
        farmasi_queue_number: farmasiArray.payload.farmasi_queue_number ?? "-",
        medicine_type: statusMedicine ?? "-",
        SEP: farmasiArray.payload.sep_no ?? "-",
        tanggal_lahir: farmasiArray.payload?.patient_date_of_birth ?? null,
        queue_number: farmasiArray.payload.farmasi_queue_number ?? null,
      }

      const print = await printAntrianFarmasi(printPayload);
      const io = req.app.get('socketio');
      
      if (print.success == false) {
        io.emit('print_error', {
          message: 'Print Error'
        });
      }
    }

    return res.status(201).json({
      message: "Data berhasil diproses",
      doctor_appointment: existingDoctorAppointment,
      pharmacy_task: existingPharmacyTask,
      verification_task: existingVerificationTask,
      result: payload
    });

  } catch (error) {
    console.error("GET FARMASI LIST ERROR", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

module.exports = {
  getFarmasiList
}