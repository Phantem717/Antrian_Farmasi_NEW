const VerificationTask = require('../models/verificationTask');
const MedicineTask = require('../models/medicineTask');
const DoctorAppointment = require('../models/doctorAppointments');
const PharmacyTask = require('../models/pharmacyTask');
const {getAllResponses}= require('../controllers/responsesController')
const sendWA = require('../services/sendWAService2');
const { checkQueue, fetchRegistrationData, sendToWA } = require('../services/BarcodeService');
const { getCurrentTimestamp, convertToJakartaTime } = require('../handler/timeHandler');
const { createAntrianFarmasi } = require('../services/createFarmasiQueueService');
const { createVerificationTaskInternal } = require('./verificationTaskController');
const { printAntrianFarmasi } = require('../services/printAntrianService');
const { getDb } = require('../config/db');
const {sendWAAntrian} = require('../services/sendWAService2');
let io;
let shouldEmit;

async function retryOperation(operation, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
  
  throw lastError;
}



async function insertAll(payload) {
  const pool = await getDb();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

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
      phone_number: payload.phone_number || "-",
      doctor_name: payload.doctor_name || "-",
      nik: payload.nik || "-",
      farmasi_queue_number: payload.farmasi_queue_number || "-",
      NOP: payload.NOP || "-",
      PRB: payload.PRB || null,
      total_medicine:  payload.total_medicine || 0
    };

    const pharmacyPayload = {
      NOP: payload.NOP,
      status: "waiting_verification",
      medicine_type: payload.statusMedicine,
      lokasi: payload.location
    };
    const pharmacyData = await PharmacyTask.create(pharmacyPayload, conn);
  const verificationData = await VerificationTask.create({
      NOP: payload.NOP,
      lokasi: payload.location
    }, conn);

    const doctorAppointment = await DoctorAppointment.create(doctorAppointmentData, conn);
  
    await conn.commit();

    return { doctorAppointment, pharmacyData, verificationData };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

const getFarmasiList = async (req, res) => {
        const io = req.app.get('socketio');

  console.log("GETLIST");
  try {
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Body Is Empty" });
    }

    const farmasiArray = req.body;
    const NOP = farmasiArray.payload.NOP;
    console.log("FARM",farmasiArray);
    
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
        shouldEmit = true;

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
        PRB: farmasiArray.payload.PRB ?? null,
        total_medicine: farmasiArray.payload.total_medicine ?? 0
      };

      result = await insertAll(payload);
      existingDoctorAppointment = result.doctorAppointment;
      existingPharmacyTask = result.pharmacyData;
      existingVerificationTask = result.verificationData;


      const printPayload = {
        phone_number: farmasiArray.payload.phone_number ?? "-",
        barcode: farmasiArray.payload.NOP ?? "-",
        patient_name: farmasiArray.payload.patient_name ?? "-",
        farmasi_queue_number: farmasiArray.payload.farmasi_queue_number ?? "-",
        medicine_type: statusMedicine ?? "-",
        lokasi: "Lantai 1 BPJS",
        SEP: farmasiArray.payload.sep_no ?? "-",
        tanggal_lahir: farmasiArray.payload?.patient_date_of_birth ?? null,
        queue_number: farmasiArray.payload.farmasi_queue_number ?? null,
        PRB: farmasiArray.payload.PRB ?? null,
        doctor_name: farmasiArray.payload.doctor_name ?? null
      }
      let new_phone_number;
        if (farmasiArray.payload.phone_number.startsWith("0")) {
      new_phone_number = "62" + farmasiArray.payload.phone_number.slice(1);
      console.log("PH1",new_phone_number)
    }
    else{
      new_phone_number = farmasiArray.payload.phone_number
    }
       const wa_payload = {

            phone_number: new_phone_number,
            patient_name: farmasiArray.payload.patient_name ,
            NOP: farmasiArray.payload.NOP,
            queue_number: farmasiArray.payload.farmasi_queue_number,
            medicine_type: statusMedicine,
            sep: farmasiArray.payload.sep_no,
            rm: farmasiArray.payload.medical_record_no ,
            docter:  farmasiArray.payload?.doctor_name,
            nik:  farmasiArray.payload.nik || "-",
            prev_queue_number: "-",
            switch_WA: "true",
            location: "Lantai 1 BPJS"

        };
            // const waResp = await sendWAAntrian(wa_payload);
            // console.log("WA RESPONSE:", waResp,wa_payload);
const print = await retryOperation(
    () => printAntrianFarmasi(printPayload),
    3, // max retries
    1000 // initial delay (will increase exponentially)
  );
      await new Promise(resolve => setTimeout(resolve, 2000)); // 1-second delay

      
      if (print.success == false) {
        io.emit('print_error', {
          message: 'Print Error'
        });
      }

    
      const data = await getAllResponses("Lantai 1 BPJS");

       io.emit('insert_appointment', {

    message: 'Doctor Created Successfully',
    data: data
  });
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
