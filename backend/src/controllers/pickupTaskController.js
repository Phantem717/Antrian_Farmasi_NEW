// src/controllers/pickupTaskController.js
const PickupTask = require('../models/pickupTask');
const {getCurrentTimestamp}  = require('../handler/timeHandler')
// const io = req.app.get('socketio');
/**
 * Controller untuk membuat Pickup Task baru.
 * Catatan: Field waiting_pickup_medicine_stamp diisi otomatis oleh query (menggunakan SQL NOW())
 */
const createPickupTask = async (req, res) => {
  try {
    const data = req.body;
    const result = await PickupTask.create(data);
    const io = req.app.get('socketio');

    io.emit('create_pickup',{
      message: "Create Pickup",
      data: result
    });
    res.status(201).json({ message: 'Pickup Task created successfully', data: result });
  } catch (error) {
    console.error('Error creating Pickup Task:', error.message);
    res.status(500).json({ message: 'Failed to create Pickup Task', error: error.message });
  }
};

/**
 * Controller untuk mengambil Pickup Task berdasarkan NOP.
 */
const getPickupTaskByNOP = async (req, res) => {
  try {
    const { NOP } = req.params;
    const task = await PickupTask.findByNOP(NOP);
    if (!task) {
      return res.status(404).json({ message: 'Pickup Task not found' });
    }
    res.status(200).json({ data: task });
  } catch (error) {
    console.error('Error retrieving Pickup Task:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Pickup Task', error: error.message });
  }
};

/**
 * Controller untuk mengambil semua Pickup Task.
 */
const getAllPickupTasks = async (req, res) => {
  try {
    const tasks = await PickupTask.getAll();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error('Error retrieving Pickup Tasks:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Pickup Tasks', error: error.message });
  }
};

/**
 * Controller untuk memperbarui Pickup Task berdasarkan NOP.
 * Hanya field target (berdasarkan status) yang akan di-update dengan timestamp baru
 * jika field tersebut masih null (belum pernah terisi).
 *
 * Misalnya, status yang dikirim oleh client adalah:
 * - "waiting_pickup_medicine"
 * - "called_pickup_medicine"
 * - "recalled_pickup_medicine"
 * - "pending_pickup_medicine"
 * - "processed_pickup_medicine"
 * - "completed_pickup_medicine"
 */
const updatePickupTask = async (req, res) => {
  try {
    const { NOP } = req.params;
    const { Executor, Executor_Names, status, loket } = req.body;

    // 1. Ambil data lama dari database
    const existingData = await PickupTask.findByNOP(NOP);
    if (!existingData) {
      return res.status(404).json({ message: "Pickup Task not found" });
    }

    // 2. Buat objek updatedData dengan mewarisi data lama
    const updatedData = {
      Executor: Executor !== undefined ? Executor : existingData.Executor,
      Executor_Names: Executor_Names !== undefined ? Executor_Names : existingData.Executor_Names,
      waiting_pickup_medicine_stamp: existingData.waiting_pickup_medicine_stamp,
      called_pickup_medicine_stamp: existingData.called_pickup_medicine_stamp,
      recalled_pickup_medicine_stamp: existingData.recalled_pickup_medicine_stamp,
      pending_pickup_medicine_stamp: existingData.pending_pickup_medicine_stamp,
      processed_pickup_medicine_stamp: existingData.processed_pickup_medicine_stamp,
      completed_pickup_medicine_stamp: existingData.completed_pickup_medicine_stamp,
      loket : loket !== undefined ? loket : existingData.loket,
    };

    // 3. Dapatkan timestamp saat ini dalam format MySQL "YYYY-MM-DD HH:mm:ss"
    const now = getCurrentTimestamp();
    console.log("NOW DATE",now);
    // 4. Update hanya field target berdasarkan status baru jika nilainya masih null
    switch (status) {
      case "waiting_pickup_medicine":
        if (!existingData.waiting_pickup_medicine_stamp) {
          updatedData.waiting_pickup_medicine_stamp = now;
        }
        break;
      case "called_pickup_medicine":
        if (!existingData.called_pickup_medicine_stamp) {
          updatedData.called_pickup_medicine_stamp = now;
        }
        break;
      case "recalled_pickup_medicine":
        if (!existingData.recalled_pickup_medicine_stamp) {
          updatedData.recalled_pickup_medicine_stamp = now;
        }
        break;
      case "pending_pickup_medicine":
        if (!existingData.pending_pickup_medicine_stamp) {
          updatedData.pending_pickup_medicine_stamp = now;
        }
        break;
      case "processed_pickup_medicine":
        if (!existingData.processed_pickup_medicine_stamp) {
          updatedData.processed_pickup_medicine_stamp = now;
        }
        break;
      case "completed_pickup_medicine":
        if (!existingData.completed_pickup_medicine_stamp) {
          updatedData.completed_pickup_medicine_stamp = now;
        }
        break;
      default:
        // Jika status tidak dikenal, tidak ada field timestamp yang diupdate
        break;
    }

    // 5. Simpan perubahan ke database
    const result = await PickupTask.update(NOP, updatedData);
    const io = req.app.get('socketio');

    io.emit('update_pickup',{
      message: "Update Pickup",
      data: result
    });
    return res.status(200).json({
      message: "Pickup Task updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating Pickup Task:", error.message);
    return res.status(500).json({
      message: "Failed to update Pickup Task",
      error: error.message
    });
  }
};

/**
 * Controller untuk menghapus Pickup Task berdasarkan NOP.
 */
const deletePickupTask = async (req, res) => {
  try {
    const { NOP } = req.params;
    const result = await PickupTask.delete(NOP);
    const io = req.app.get('socketio');

    io.emit('delete_pickup',{
      message: "Delete Pickup",
      // data: result
    });
    res.status(200).json({ message: 'Pickup Task deleted successfully', data: result });
  } catch (error) {
    console.error('Error deleting Pickup Task:', error.message);
    res.status(500).json({ message: 'Failed to delete Pickup Task', error: error.message });
  }
};

module.exports = {
  createPickupTask,
  getPickupTaskByNOP,
  getAllPickupTasks,
  updatePickupTask,
  deletePickupTask,
};
