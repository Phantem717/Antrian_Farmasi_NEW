// src/controllers/doctorAppointmentsController.js

const DoctorAppointment = require('../models/doctorAppointments');
// const io = req.app.get('socketio');

/**
 * Controller untuk membuat appointment baru.
 */
const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const result = await DoctorAppointment.create(appointmentData);
    const io = req.app.get('socketio');

    io.emit('new_doctor_appointment',{
      message: 'Doctor Created Succesfully',
      data: result
    });

    //PUT IN FRONTEND TO DISPLAY DATA
    // socket.on("new_doctor_appointment", (result) => {
    //   console.log("?? Got new booking from server!", result);
    // });
    

    res.status(201).json({ 
      message: 'Appointment created successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Failed to create appointment', 
      error: error.message 
    });
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


/**
 * Controller untuk mendapatkan appointment berdasarkan booking_id.
 */
const getAppointment = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const appointment = await DoctorAppointment.findByBookingId(bookingId);
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
 * Controller untuk memperbarui appointment berdasarkan booking_id.
 */
const updateAppointment = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const appointmentData = req.body;
    const result = await DoctorAppointment.update(bookingId, appointmentData);
    const io = req.app.get('socketio');

    // const io = req.app.get('socketio')
    io.emit('doctor_appointment_updated', {
      message: "Updated Data",
      bookingId: bookingId,
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
    const bookingId = req.params.bookingId;
    const { status_medicine } = req.body;

    if (!status_medicine) {
      return res.status(400).json({ message: "status_medicine is required" });
    }

    const result = await DoctorAppointment.updateStatusMedicine(bookingId, status_medicine);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Appointment not found or no changes made' });
    }
    const io = req.app.get('socketio');

    // const io = require('socketio');
    io.emit('update_status_medicine',{
      message:"Update Status Medicine Succesful",
      data:result,
      bookingId: bookingId,
      status_medicine: status_medicine
    })    

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
 * Controller untuk menghapus appointment berdasarkan booking_id.
 */
const deleteAppointment = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const result = await DoctorAppointment.delete(bookingId);
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
module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointment,
  updateAppointment,
  updateStatusMedicine,
  deleteAppointment,
  getLatestAntrian
};
