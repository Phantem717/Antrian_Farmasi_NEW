
const GMCBTemp= require('../models/GMCBTemp');
const {getAllResponses}= require('./responsesController')
const sendWA = require('../services/sendWAService2');
const VerificationTask = require('../models/verificationTask');
const GMCBAppointments = require('../models/GMCBAppointments');
const PharmacyTask = require('../models/pharmacyTask');
const { printAntrianFarmasi } = require('../services/printAntrianService');
const { getDb } = require('../config/db');
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
      id: payload.id,
      queue_number: payload.queue_number,
      queue_status: payload.queue_status,
      queue_type: payload.queue_type,
     location: payload.location,

    };
    const doctorAppointment = await GMCBTemp.create(doctorAppointmentData, conn);
  
    const pharmacyPayload = {
      NOP: payload.id,
      status: "waiting_verification",
      medicine_type: "-",
      lokasi: payload.location
    };
    const pharmacyData = await PharmacyTask.create(pharmacyPayload, conn);
  const verificationData = await VerificationTask.create({
      NOP: payload.id,
      lokasi: payload.location
    }, conn);

    await conn.commit();

    return  {doctorAppointment, pharmacyData, verificationData};
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function createNewAppointment(payload){
 const pool = await getDb();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const doctorAppointmentData = {
      sep_no: payload.sep_no || null,
      queue_number: payload.queue_number || null,
      queue_status: payload.queue_status || null,
      patient_name: payload.patient_name || null,
      medical_record_no: payload.medical_record_no || null,
      patient_date_of_birth: payload.patient_date_of_birth || null,
      medicine_type: payload.statusMedicine,
      lokasi: payload.location || null,
      phone_number: payload.phone_number || "-",
      doctor_name: payload.doctor_name || "-",
      nik: payload.nik || "-",
      NOP: payload.NOP || null,
      payment_type: payload.payment_type || null,
      isPaid: payload.isPaid || false,
      location_from: payload.location_from || null,
      poliklinik: payload.poliklinik || null,
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

    const doctorAppointment = await GMCBAppointments.create(doctorAppointmentData, conn);
  
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
    let result = {};
    let payload = {};
    shouldEmit = true;

    const queueNumber = farmasiArray.payload.queue_number;

    // Today in YYYYMMDD
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const id = `${dateStr}-${queueNumber}`;

      payload = {
        id:id ?? null,
        queue_number: farmasiArray.payload.queue_number ?? null,
        queue_status: farmasiArray.payload.queue_status ?? "Menunggu",
        queue_type: farmasiArray.payload.queue_type ?? "Asuransi",
        location: "Lantai 1 GMCB",
 
      };

      result = await insertAll(payload);
      existingDoctorAppointment = result.doctorAppointment;

      const printPayload = {
        phone_number: farmasiArray.payload.phone_number ?? "-",
        barcode: farmasiArray.payload.id ?? "-",
        patient_name: farmasiArray.payload.patient_name ?? "-",
        farmasi_queue_number: farmasiArray.payload.farmasi_queue_number ?? "-",
        medicine_type: statusMedicine ?? "-",
        lokasi: "Lantai 1 GMCB",
        SEP: farmasiArray.payload.sep_no ?? "-",
        tanggal_lahir: farmasiArray.payload?.patient_date_of_birth ?? null,
        queue_number: farmasiArray.payload.farmasi_queue_number ?? null,
        PRB: farmasiArray.payload.PRB ?? null,
        doctor_name: farmasiArray.payload.doctor_name ?? null
      }
      
// const print = await retryOperation(
//     () => printAntrianFarmasi(printPayload),
//     3, // max retries
//     1000 // initial delay (will increase exponentially)
//   );
//       await new Promise(resolve => setTimeout(resolve, 2000)); // 1-second delay

      
//       if (print.success == false) {
//         io.emit('print_error', {
//           message: 'Print Error'
//         });
//       }

      const data = await getAllResponses("Lantai 1 GMCB");
      
      io.emit('insert_appointment', {
          message: 'Doctor Created Successfully',
          data: data
      });

    return res.status(201).json({
      message: "Data berhasil diproses",
      doctor_appointment: existingDoctorAppointment,
      result: payload
    });

  } catch (error) {
    console.error("GET FARMASI LIST ERROR", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


const createAppointment = async (req, res) => {
  try {
    let appointmentData = req.body;
    let location = appointmentData.lokasi;

if(location.toLowerCase() == "bpjs"){
      location = "Lantai 1 BPJS" 
    }
    if(location.toLowerCase() == "gmcb"){
      location = "Lantai 1 GMCB" 

    }
     if(location.toLowerCase() == "lt3"){
      location = "Lantai 3 GMCB" 

    }     
    appointmentData.lokasi = location;
    const result = await GMCBTemp.create(appointmentData);
    const io = req.app.get('socketio');


    res.status(201).json({ 
      message: 'Appointment created successfully', 
      data: result 
    });
  } catch (error) {
     if(error.message.startsWith("Duplicate")){
      console.log("HIT");
          res.status(500).json({ message: 'Data Sudah Diproses', error: error.message });

    }else{
   console.error('Error creating APPOINTMENT Task:', error.message);
    res.status(500).json({ message: 'Failed to create APOINTMENT Task', error: error.message });
    }
  }
};

/**
 * Controller untuk mengambil semua appointment tanpa limit.
 */
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await GMCBTemp.findAll();
    
    res.status(200).json({ 
      message: "List of all appointments",
      data: appointments
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      message: "Failed to fetch appointments", 
      error: error.message 
    });
  }
};

const getAllAppointmentsByLocation = async (req, res) => {
  try {
    let location = req.params.category;
    if(location.toLowerCase() == "bpjs"){
      location = "Lantai 1 BPJS" 
    }
    if(location.toLowerCase() == "gmcb"){
      location = "Lantai 1 GMCB" 

    }
     if(location.toLowerCase() == "lt3"){
      location = "Lantai 3 GMCB" 

    }    const appointments = await GMCBTemp.findAllByLocation(location);
    
    res.status(200).json({ 
      message: "List of all appointments",
      data: appointments
    });
  }catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      message: "Failed to fetch appointments", 
      error: error.message 
    });
   
  } 
  }
;

/**
 * Controller untuk mendapatkan appointment berdasarkan id.
 */

const getAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const appointment = await GMCBTemp.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.status(200).json({ data: appointment });
  } catch (error) {
    console.error('Error retrieving appointment:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve appointment', 
      error: error.message 
    });
  }
};

/**
 * Controller untuk menghapus appointment berdasarkan id.
 */
const deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await GMCBTemp.delete(id);
    const io = req.app.get('socketio');

    io.emit('delete_doctor_appointment',{
      message: 'data deleted'
    })

    res.status(200).json({ 
      message: 'Appointment deleted successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      message: 'Failed to delete appointment', 
      error: error.message 
    });
  }
};

const getLatestAntrian = async(req,res)=>{
  try {
    const antrian = await GMCBTemp.getLatestAntrian();
    
    res.status(200).json({ 
      message: "Latest Antrian",
      data: antrian
    });
  } catch (error) {
    console.error("Error fetching antrian:", error);
    res.status(500).json({ 
      message: "Failed to fetch antrian", 
      error: error.message 
    });
  }
}


const updateAntrian = async (req,res)=>{
  try {
    const { queue_status, id } = req.body;
    const antrian = await GMCBTemp.updateStatus(queue_status, id);
    
    res.status(200).json({ 
      message: "Updated Antrian",
      data: antrian
    });
  } catch (error) {
    console.error("Error fetching antrian:", error);
    res.status(500).json({ 
      message: "Failed to fetch antrian", 
      error: error.message 
    });
  }
}

const verifyTempQueue = async (req, res) => {
  try {
    const { tempId,verificationData } = req.body;
    const antrian = await GMCBTemp.verifyTempQueue(tempId, verificationData);
    
    res.status(200).json({ 
      message: "Verified Antrian",
      data: antrian
    });
  } catch (error) {
    console.error("Error fetching antrian:", error);
    res.status(500).json({ 
      message: "Failed to fetch antrian", 
      error: error.message 
    });
  }
}
module.exports = {
  getFarmasiList,
  updateAntrian,
  getAllAppointments,
  getAllAppointmentsByLocation,
  getAppointment,
  deleteAppointment,
  getLatestAntrian,
  createAppointment,
  verifyTempQueue
}
