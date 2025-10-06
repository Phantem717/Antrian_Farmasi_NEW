// src/controllers/doctorAppointmentsController.js

const DoctorAppointment = require('../models/doctorAppointments');

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
    const result = await DoctorAppointment.create(appointmentData);
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
    const appointments = await DoctorAppointment.findAll();
    
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

    }    const appointments = await DoctorAppointment.findAllByLocation(location);
    
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
    const appointment = await DoctorAppointment.findByNOP(NOP);
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
    const result = await DoctorAppointment.update(NOP, appointmentData);
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

    const result = await DoctorAppointment.updateStatusMedicine(NOP, status_medicine);
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

    const result = await DoctorAppointment.updateMedicineType(NOP, status_medicine,farmasi_queue_number);
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
    const result = await DoctorAppointment.delete(NOP);
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
    const antrian = await DoctorAppointment.getLatestAntrian();
    
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

    const result = await DoctorAppointment.updatePhoneNumber(NOP,phone_number);
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
    const NOP = req.params.NOP;
    const { total_medicine } = req.body;

    // console.log("DATA UPDATE TYPE", status_medicine,NOP,farmasi_queue_number);
    if (!total_medicine) {
      return res.status(400).json({ message: "status_medicine is required" });
    }

    const result = await DoctorAppointment.updateTotalMedicine(NOP,total_medicine);
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
  updateTotalMedicineController
};
