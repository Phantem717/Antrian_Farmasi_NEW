// src/controllers/GMCBAppointmentsController.js
const axios = require('axios');
const {checkRegistrationInfo} = require('../services/checkRegistrationInfo')
const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_FARMASI;

const GMCBAppointment = require('../models/GMCBAppointments');
const totalService = require('../services/totalUpdateService')
/**
 * Controller untuk membuat appointment baru.
 */
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
    const result = await GMCBAppointment.create(appointmentData);
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
    const appointments = await GMCBAppointment.findAll();
    
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

    }    const appointments = await GMCBAppointment.findAllByLocation(location);
    
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
 * Controller untuk mendapatkan appointment berdasarkan NOP.
 */
const getAppointment = async (req, res) => {
  try {
    const NOP = req.params.NOP;
    const appointment = await GMCBAppointment.findByNOP(NOP);
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
 * Controller untuk memperbarui appointment berdasarkan NOP.
 */
const updateAppointment = async (req, res) => {
  try {
    const NOP = req.params.NOP;
    const appointmentData = req.body;
    const result = await GMCBAppointment.update(NOP, appointmentData);
    const io = req.app.get('socketio');

    // const io = req.app.get('socketio')
    io.emit('doctor_appointment_updated', {
      message: "Updated Data",
      NOP: NOP,
      appointmentData: appointmentData,
      data : result,
    });

    res.status(200).json({ 
      message: 'Appointment updated successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ 
      message: 'Failed to update appointment', 
      error: error.message 
    });
  }
};
const updateStatusMedicine = async (req, res) => {
  try {
    const NOP = req.params.NOP;
    const { status_medicine } = req.body;

    if (!status_medicine) {
      return res.status(400).json({ message: "status_medicine is required" });
    }

    const result = await GMCBAppointment.updateStatusMedicine(NOP, status_medicine);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }
    const io = req.app.get('socketio');

    // const io = require('socketio');
    

    res.status(200).json({
      message: 'Status medicine updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating status medicine:', error);
    res.status(500).json({ 
      message: 'Failed to update status medicine', 
      error: error.message 
    });
  }
};

const updateMedicineType = async (req, res) => {
  try {
    const NOP = req.params.NOP;
    const { status_medicine,farmasi_queue_number } = req.body;

    console.log("DATA UPDATE TYPE", status_medicine,NOP,farmasi_queue_number);
    if (!status_medicine || !status_medicine || !farmasi_queue_number) {
      return res.status(400).json({ message: "status_medicine is required" });
    }

    const result = await GMCBAppointment.updateMedicineType(NOP, status_medicine,farmasi_queue_number);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }
    const io = req.app.get('socketio');

    // const io = require('socketio');
    

    res.status(200).json({
      message: 'Status medicine updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating status medicine:', error);
    res.status(500).json({ 
      message: 'Failed to update status medicine', 
      error: error.message 
    });
  }
};

/**
 * Controller untuk menghapus appointment berdasarkan NOP.
 */
const deleteAppointment = async (req, res) => {
  try {
    const NOP = req.params.NOP;
    const result = await GMCBAppointment.delete(NOP);
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
    const antrian = await GMCBAppointment.getLatestAntrian();
    
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

const updatePhoneNumber = async (req,res)=>{
  try {
    const NOP = req.params.NOP;
    const { phone_number } = req.body;

    // console.log("DATA UPDATE TYPE", status_medicine,NOP,farmasi_queue_number);
    if (!phone_number) {
      return res.status(400).json({ message: "status_medicine is required" });
    }

    const result = await GMCBAppointment.updatePhoneNumber(NOP,phone_number);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }

    // const io = require('socketio');
    

    res.status(200).json({
      message: 'Status medicine updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating status medicine:', error);
    res.status(500).json({ 
      message: 'Failed to update status medicine', 
      error: error.message 
    });
  }
}

const updateTotalMedicineController = async (req,res)=>{
  try {
    // const NOP = req.params.NOP;
    const { NOP,total_medicine } = req.body;

    // console.log("DATA UPDATE TYPE", status_medicine,NOP,farmasi_queue_number);
    if (!total_medicine) {
      return res.status(400).json({ message: "status_medicine is required" });
    }

    const result = await GMCBAppointment.updateTotalMedicine(NOP,total_medicine);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }

    // const io = require('socketio');
    

    res.status(200).json({
      message: 'Status medicine updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating status medicine:', error);
    res.status(500).json({ 
      message: 'Failed to update status medicine', 
      error: error.message 
    });
  }

  
}


const updateGMCBAppointmentController = async (req,res)=>{
  try {
    // const NOP = req.params.NOP;
    const { NOP } = req.params;
    const { queue_number } = req.body;
    console.log("DATA UPDATE TYPE", NOP,queue_number);
    const result = await GMCBAppointment.updateDoctorAppointment(NOP,queue_number);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }

    // const io = require('socketio');
    

    res.status(200).json({
      message: 'Status medicine updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating status medicine:', error);
    res.status(500).json({ 
      message: 'Failed to update status medicine', 
      error: error.message 
    });
  }

  
}

const RouteUpdateDoubleController = async (req,res)=>{
    // const NOP = req.params.NOP;
    const datas = await GMCBAppointment.getAllDouble();
    // console.log("DATA UPDATE TYPE", datas);
      const { timestamp, signature } = generateSignature(consID2, password);
try {
    // const response = await axios({
    //   method: 'get',
    //   url: process.env.MEDIN_URL2,
    //   data: { registrationNo: registrationNo }, // Body for GET
    //   headers: {
    //     'X-cons-id': process.env.CONS_ID_FARMASI,
    //     'X-Timestamp': timestamp,
    //     'X-Signature': signature,
    //     'Content-Type': 'application/json'
    //   }
    // });
    const headers = {
        'X-cons-id': process.env.CONS_ID_FARMASI,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
    }
    // datas.forEach(async (nop) => {
      
    //   const response = await axios.post(`http://192.168.6.85/api/v1/visit/queue/pharmacy/queue`, headers,{
    //     registration_no: nop.NOP
    //   })
    //   // if(response.data.message == "success"){
    //   //   GMCBAppointment.updateGMCBAppointment(nop.NOP,response.data.data.queue_number)
        
    //   // }
    //   // if(response.data.message != "success"){
    //   //     console.log("DATA",nop);

    //   // }
    //   console.log("RESPONSE",response);
    // });
    for (const nop of datas) {
  console.log("PROCESSING", nop.NOP);

  try {
    const response = await axios.post(
      "http://192.168.6.85/api/v1/visit/queue/pharmacy/queue",
      { registration_no: nop.NOP },
      { headers }
    );
      console.log("RESPONSE",response.data.success);

    if (response.data.success) {
      await GMCBAppointment.updateGMCBAppointment(
        nop.NOP,
        response.data.data.queue_number
      );
    } else {
      console.log("FAILED", nop.NOP);
    }

  } catch (err) {
    console.error("ERR FOR", nop.NOP, err);
  }
}

    res.status(200).json({
      message: 'Status medicine updated successfully',
      data: datas
    })
  } catch (error) {
    console.error('Error updating status medicine:', error);
    res.status(500).json({ 
      message: 'Failed to update status medicine', 
      error: error.message 
    });
  }
}



const getDoctorTotalByDate= async (req,res) => {
 try {
    const { date,category } = req.params;
    let location = category;
    if(location.toLowerCase() == "bpjs"){
      location = "Lantai 1 BPJS" 
    }
    if(location.toLowerCase() == "gmcb"){
      location = "Lantai 1 GMCB" 

    }
     if(location.toLowerCase() == "lt3"){
      location = "Lantai 3 GMCB" 

    } 
    const task = await GMCBAppointment.getByDateForTotal(location,date);
    console.log("TASK",task);
    if (!task) {
      return res.status(404).json({ message: 'Verification Task not found' });
    }

     for (const element of task) {
      console.log("ELEMENT",element.NOP);
      const total = await totalService.getTotal(element.NOP);
      console.log("TOTAL",total);
      const response = await GMCBAppointment.updateTotalMedicine(element.NOP,total);
      console.log("RESP",response);
    }

    res.status(200).json({ data: task });
  } catch (error) {
    console.error('Error retrieving Verification Task:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Verification Task', error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { NOP} = req.params;
    console.log("NOP PAYMENT",NOP);
    const getData = await checkRegistrationInfo(NOP);
    if (!getData) {
      return res.status(404).json({ message: 'Data not found' });
    }

    const result = await GMCBAppointment.updatePaymentStatus(NOP, getData.LastPaymentDate);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }
    res.status(200).json({
      message: 'Payment status updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
}
module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  updateStatusMedicine,
  deleteAppointment,
  getLatestAntrian,
  updateMedicineType,
  updatePhoneNumber,
  getAllAppointmentsByLocation,
  updateTotalMedicineController,
  getDoctorTotalByDate,
  updateGMCBAppointmentController,
  RouteUpdateDoubleController,
  updatePaymentStatus
};
