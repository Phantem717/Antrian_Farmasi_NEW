// src/controllers/pharmacyTaskController.js
const VerificationTask = require('../models/verificationTask');

const PharmacyTask = require('../models/pharmacyTask');
const { generateFourDigitNumber } = require('../handler/generate'); // Import fungsi generator
/**
 * Controller untuk membuat Pharmacy Task baru dengan ID otomatis.
 */
const createPharmacyTask = async (req, res) => {
  try {
    const { NOP, status, medicine_type,lokasi } = req.body;

    // Validasi input
    if (!NOP || !status || !medicine_type) {
      return res.status(400).json({ message: "Booking ID, status, dan medicine_type wajib diisi." });
    }

    // 🔹 Buat task baru
    const taskData = {
      NOP,
      status,
      medicine_type,
      lokasi
    };

    console.log("Pharmacy Task Data Before Insert:", taskData); // Debugging

    // 🔹 Simpan ke database
    const result = await PharmacyTask.create(taskData);
    const io = req.app.get('socketio');

    io.emit('create_pharmacy',{
      message: "Create Pharmacy",
      data: {...taskData},
      result : result,
    });

    res.status(201).json({
      message: "Pharmacy Task created successfully",
      data: { ...taskData }
    });

  } catch (error) {
    console.error("Error creating pharmacy task:", error);
    res.status(500).json({
      message: "Failed to create pharmacy task",
      error: error.message,
    });
  }
};

/**
 * Controller untuk mengambil Pharmacy Task berdasarkan Booking ID.
 */
const getPharmacyTaskByNOP = async (req, res) => {
  try {
    const { NOP } = req.params;
    const task = await PharmacyTask.findByNOP(NOP);
    if (!task) {
      return res.status(404).json({ message: 'Pharmacy Task not found' });
    }
    res.status(200).json({ data: task });
  } catch (error) {
    console.error('Error retrieving pharmacy task by booking ID:', error);
    res.status(500).json({
      message: 'Failed to retrieve pharmacy task',
      error: error.message,
    });
  }
};

/**
 * Controller untuk mengambil semua Pharmacy Task.
 */
const getAllPharmacyTasks = async (req, res) => {
  try {
    const tasks = await PharmacyTask.getAll();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error('Error retrieving all pharmacy tasks:', error);
    res.status(500).json({
      message: 'Failed to retrieve pharmacy tasks',
      error: error.message,
    });
  }
};

/**
 * Controller untuk memperbarui Pharmacy Task berdasarkan Booking ID.
 */
const updatePharmacyTask = async (req, res) => {
  try {
    const { NOP } = req.params;
    const taskData = req.body;

    // Cek apakah task ada sebelum update
    const existingTask = await PharmacyTask.findByNOP(NOP);
    if (!existingTask) {
      return res.status(404).json({ message: 'Pharmacy Task not found' });
    }
    const io = req.app.get('socketio');

    const result = await PharmacyTask.update(NOP, taskData);
    const verificationData = await VerificationTask.findByNOP(NOP);
    console.log("TASKDATA",taskData, verificationData);

    if(taskData.status == "recalled_verification" || taskData.status == "called_pickup_medicine" || taskData.status == "recalled_pickup_medicine"){
      const allPharmacyTasks = await PharmacyTask.getAll(); // <--- Here

      io.emit('update_status_type', {
        message: "Update Status Medicine Type Succesful",
        data: allPharmacyTasks,
        // NOP: NOP,
      });
    }
    res.status(200).json({
      message: 'Pharmacy Task updated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error updating pharmacy task:', error);
    res.status(500).json({
      message: 'Failed to update pharmacy task',
      error: error.message,
    });
  }
};

/**
 * Controller untuk menghapus Pharmacy Task berdasarkan Booking ID.
 */
const deletePharmacyTask = async (req, res) => {
  try {
    const { NOP } = req.params;

    // Cek apakah task ada sebelum dihapus
    // const existingTask = await PharmacyTask.findByNOP(NOP);
    // if (!existingTask) {
    //   return res.status(404).json({ message: 'Pharmacy Task not found' });
    // }
    const io = req.app.get('socketio');

    const result = await PharmacyTask.delete(NOP);
    io.emit('Delete_pharmacy',{
      message: "Update Pharmacy",
      
      // data : result,
    });
    res.status(200).json({
      message: 'Pharmacy Task deleted successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error deleting pharmacy task:', error);
    res.status(500).json({
      message: 'Failed to delete pharmacy task',
      error: error.message,
    });
  }
};

module.exports = {
  createPharmacyTask,
  getPharmacyTaskByNOP,
  getAllPharmacyTasks,
  updatePharmacyTask,
  deletePharmacyTask,
};
