// backend_farmasi\src\controllers\barcodeController.js
const { checkQueue, fetchRegistrationData,sendToWA } = require('../services/BarcodeService');
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
 * Controller untuk mengecek queue berdasarkan booking_id.
 * Mengambil booking_id dari query parameter.
 */
const checkQueueController = async (req, res) => {
  try {
    const { booking_id } = req.query;
    if (!booking_id) {
      return res.status(400).json({ message: 'Parameter booking_id wajib diisi.' });
    }
    const data = await checkQueue(booking_id);

   
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error pada checkQueueController:', error.message);
    res.status(500).json({ message: 'Gagal mengecek queue', error: error.message });
  }
};

 async function insertAll(payload){
  // Jika Doctor Appointment belum ada, buat baru
  
   const doctorAppointmentData = {
      booking_id: payload.booking_id || null,
      sep_no: payload.sep_no || null,
      queue_number: payload.queue_number || null,
      queue_status: payload.queue_status || null,
      queue_type: payload.queue_type || null,
      patient_name: payload.patient_name || null,
      medical_record_no: payload.medical_record_no || null,
      patient_date_of_birth: payload.patient_date_of_birth || null,
      status_medicine: payload.statusMedicine, // Menggunakan nilai dari response registrasi,
      lokasi:payload.location || null,
      phone_number: payload.phone_number || null,
      doctor_name: payload.doctor_name || null,
      nik: payload.nik || "-",
      farmasi_queue_number: payload.farmasi_queue_number || "-"

    };
    console.log("Doctor Appointment Data Before Insert:", doctorAppointmentData);
   

    const pharmacyPayload = {
      booking_id: payload.booking_id,
      status: "waiting_verification",
      medicine_type: payload.statusMedicine,
      lokasi:payload.location

    };
    // Pastikan Verification Task dibuat setelah Pharmacy Task ada
    let [doctorAppointment,verificationData,pharmacyData] = await Promise.all([
      DoctorAppointments.create(doctorAppointmentData),createVerificationTaskInternal(payload.booking_id,null,null, "waiting_verification",payload.location),PharmacyTask.create(pharmacyPayload)
    ]);

    return { doctorAppointment, pharmacyData, verificationData };

  }

  // Pastikan Pharmacy Task dibuat terlebih dahulu
  




const sendToWAController = async(req,res) =>{
  try {
    const {phone_number} = req.body; 
 if (!phone_number) {
  return res.status(400).json({ message: 'Parameter Phone_Number wajib diisi.' });
}
 const response = await sendToWA(phone_number);
 res.status(200).json({ response });

  } catch (error) {
    console.error('Error pada sendToWA:', error.message);
    res.status(500).json({ message: 'Gagal mengecek queue', error: error.message });
  }
 
}
/**
 * Controller untuk mengecek queue berdasarkan booking_id dan langsung memasukkan data ke database.
 */

const processQueueAndInsertData = async (req, res) => {
  try {
    const { booking_id } = req.query;

    // Validasi input
    if (!booking_id) {
      return res.status(400).json({ message: 'Parameter booking_id wajib diisi.' });
    }

    // Panggil checkQueue untuk mendapatkan data antrian
    const queueResponse = await checkQueue(booking_id);
    let location= "Lantai 1 BPJS";
    
    if (!queueResponse || !queueResponse.data || !queueResponse.data.detail) {
      return res.status(404).json({ message: 'Data antrian tidak ditemukan.' });
    }

   
    
    const queueData = queueResponse.data.detail;
    const reservationData = queueResponse.data.reservation ?? {};

    console.log("Queue Data:", queueData);
    console.log("Reservation Data:", reservationData);
   
    // Ambil registrationNo dari reservationData, gunakan field registration_no_client
    const registrationNo = reservationData.registration_no_client;
    if (!registrationNo) {
      return res.status(400).json({ message: 'Parameter registrationNo tidak ditemukan pada data antrian.' });
    }

    // Panggil fungsi untuk mendapatkan data registrasi dengan registrationNo
    const registrationResponse = await fetchRegistrationData(registrationNo);
    console.log("Registration Response:", registrationResponse);

    // Tangani dua kemungkinan struktur response:
    // 1. Response langsung berupa objek dengan property message
    // 2. Response yang di-wrap di property data, misalnya { data: { message: "Ada racikan" } }
    let statusMedicine = null;
    let statusMedAPI = null;
    if (registrationResponse.message) {
      if(registrationResponse.message == "racikan"){
        statusMedicine = "Racikan";
        statusMedAPI = "racikan"
      }
     
      if(registrationResponse.message == "nonracikan"){
        statusMedicine = "Non - Racikan";
        statusMedAPI = "nonracikan"

      }
      else{
        statusMedicine = "Tidak Ada Resep";
        statusMedAPI = "nonresep"

      }
    }

      
   

    // Jika nilai masih null, artinya response tidak sesuai ekspektasi
    if (!statusMedicine) {
      console.warn("Status medicine tidak ditemukan dalam response registrasi.");
    }


    // Cek apakah data sudah ada di database untuk menghindari duplikasi
   let [existingDoctorAppointment,existingPharmacyTask,existingVerificationTask ]  = await Promise.all([DoctorAppointments.findByBookingId(booking_id),await PharmacyTask.findByBookingId(booking_id),await VerificationTask.findById(booking_id)]) ;
  

    let result = {};
    // Jika Doctor Appointment belum ada, buat baru
     

      if (!existingDoctorAppointment && !existingPharmacyTask && !existingVerificationTask) {
         
    const createAntrianResp = await createAntrianFarmasi(statusMedAPI);
    console.log("ANTRIAN RESp: ",createAntrianResp.data.queue_number);
    

        const payload = {
          booking_id: queueData.booking_id ?? null,
          sep_no: queueData.sep_no ?? null,
          queue_number: queueData.queue_number ?? null,
          queue_status: queueData.queue_status ?? null,
          queue_type: queueData.queue_type ?? null,
          patient_name: queueData.patient_name ?? null,
          medical_record_no: queueData.medical_record_no ?? null,
          patient_date_of_birth: reservationData?.patient_date_of_birth ?? null,
          statusMedicine: statusMedicine, // Menggunakan nilai dari response registrasi,
          location:location,
          phone_number: queueData.phone_number ?? null,
          doctor_name: queueData.doctor_name ?? null,
          nik: queueData.nik ?? "-",
          farmasi_queue_number: createAntrianResp.data.queue_number ?? "-"
  
        };
        console.log("INSERT PAYLOAD",payload);
        result = await insertAll(payload);
        // console.log("RESULT",result);
        existingDoctorAppointment = result.doctorAppointment;
        existingPharmacyTask = result.pharmacyData;
        existingVerificationTask = result.verificationData;

      }
    
    

    // Pastikan Pharmacy Task dibuat terlebih dahulu
    

    // Pastikan Verification Task dibuat setelah Pharmacy Task ada
   
    // Kirim respons sukses setelah semua proses selesai
    return res.status(201).json({
      message: "Data berhasil diproses",
      doctor_appointment: existingDoctorAppointment,
      pharmacy_task: existingPharmacyTask,
      verification_task: existingVerificationTask
    });

  } catch (error) {
    console.error('Error dalam processQueueAndInsertData:', error);
    return res.status(500).json({
      message: 'Gagal memproses data antrian',
      error: error.message,
    });
  }
};


const updateBarcodeTask = async (req, res) => {
  try {
    // Misal booking_id dikirim melalui parameter URL dan data user melalui body request.
    const { booking_id } = req.params;
    const { user_id, name } = req.body;
    
    // 1. Ambil data Medicine_Task berdasarkan booking_id
    const medicineData = await MedicineTask.findById(booking_id);
    if (!medicineData) {
      return res.status(404).json({ message: "Medicine Task not found" });
    }
    // 2. Update Medicine_Task:
    // Hanya mengubah Executor, Executor_Names, dan completed_medicine_stamp,
    // sedangkan field stamp lainnya diambil dari data yang sudah ada.
    const updatedMedicineData = {
      Executor: user_id || null,
      Executor_Names: name || null,
      waiting_medicine_stamp: medicineData.waiting_medicine_stamp,
      called_medicine_stamp: medicineData.called_medicine_stamp,
      recalled_medicine_stamp: medicineData.recalled_medicine_stamp,
      pending_medicine_stamp: medicineData.pending_medicine_stamp,
      processed_medicine_stamp: medicineData.processed_medicine_stamp,
      completed_medicine_stamp: getCurrentTimestamp(), // Catat waktu update
      loket: medicineData.loket,
    };
    await MedicineTask.update(booking_id, updatedMedicineData);
    console.log("MEDICINEDATA",medicineData);

    // 3. Update Pharmacy_Task status menjadi "waiting_pickup_medicine"
    const pharmacyData = await PharmacyTask.findByBookingId(booking_id);
    if (pharmacyData) {
      await PharmacyTask.update(booking_id, {
        status: "waiting_pickup_medicine",
        medicine_type: pharmacyData.medicine_type, // mempertahankan nilai medicine_type
      });
    }
    
    // 4. Buat record baru pada Pickup_Task
    await PickupTask.create({
      booking_id,
      Executor: user_id || null,
      Executor_Names: name || null,
      waiting_pickup_medicine_stamp: getCurrentTimestamp(),
      called_pickup_medicine_stamp: null,
      recalled_pickup_medicine_stamp: null,
      pending_pickup_medicine_stamp: null,
      processed_pickup_medicine_stamp: null,
      completed_pickup_medicine_stamp: null,
      lokasi: "Lantai 1 BPJS"
    });
    
    return res.status(200).json({ message: "Barcode task updated successfully" });
    
  } catch (error) {
    console.error("Error updateBarcodeTask:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// Fungsi untuk mendapatkan registration data
const getRegistrationData = async (req, res) => {
  const registrationNo = req.body.registrationNo; // Karena endpoint POST, ambil dari body

  if (!registrationNo) {
    return res.status(400).json({ error: 'registrationNo harus disediakan' });
  }

  try {
    const data = await fetchRegistrationData(registrationNo);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching registration data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = { checkQueueController, processQueueAndInsertData, updateBarcodeTask,   getRegistrationData, sendToWAController};

