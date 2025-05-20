// src/controllers/verificationTaskController.js
const VerificationTask = require('../models/verificationTask');
// const io = req.app.get('socketio');
// ✅ Fungsi internal yang bisa dipanggil oleh processQueueAndInsertData
const createVerificationTaskInternal = async (booking_id, Executor = null, Executor_Names = null, status = "waiting_verification",lokasi) => {
  try {
    const data = {
      booking_id,
      Executor,
      Executor_Names,
      status,
      lokasi
    };

    console.log("Creating Verification Task Internally with:", data);

    // 🔹 Pastikan tidak ada Verification Task duplikat
    const existingVerificationTask = await VerificationTask.findById(booking_id);
    if (existingVerificationTask) {
      console.log("Verification Task already exists, skipping creation.");
      return existingVerificationTask;
    }

    // 🔹 Buat Verification Task baru
    const result = await VerificationTask.create(data);
    return result; // ✅ Return hasil tanpa mengirim response
  } catch (error) {
    console.error('Error creating Verification Task internally:', error.message);
    throw new Error("Failed to create Verification Task");
  }
};

// ✅ Fungsi yang tetap menangani request API secara langsung
const createVerificationTask = async (req, res) => {
  try {
    const { booking_id, Executor, Executor_Names, status,location  } = req.body;

    const result = await createVerificationTaskInternal(booking_id, Executor, Executor_Names, status, location);
    const io = req.app.get('socketio');

    io.emit('create_verification', {
      message: "Create Verification",
      data: result,
    });
    res.status(201).json({ message: 'Verification Task created successfully', data: result });
  } catch (error) {
    console.error('Error creating Verification Task:', error.message);
    res.status(500).json({ message: 'Failed to create Verification Task', error: error.message });
  }
};

/**
 * Controller untuk mengambil Verification_Task berdasarkan booking_id.
 */
const getVerificationTaskById = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const task = await VerificationTask.findById(booking_id);
    if (!task) {
      return res.status(404).json({ message: 'Verification Task not found' });
    }
    res.status(200).json({ data: task });
  } catch (error) {
    console.error('Error retrieving Verification Task:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Verification Task', error: error.message });
  }
};

/**
 * Controller untuk mengambil semua Verification_Task dengan filter status tertentu.
 */
const getAllVerificationTasks = async (req, res) => {
  try {
    const tasks = await VerificationTask.getAll();

    // 🔹 Filter hanya status dari "waiting_verification" sampai "completed_verification"
    const validStatuses = [
      "waiting_verification",
      "called_verification",
      "recalled_verification",
      "pending_verification",
      "processed_verification",
      "completed_verification"
    ];

    const filteredTasks = tasks.filter(task => validStatuses.includes(task.status));

    res.status(200).json({ data: filteredTasks });
  } catch (error) {
    console.error('Error retrieving Verification Tasks:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Verification Tasks', error: error.message });
  }
};

/**
 * Controller untuk memperbarui Verification_Task berdasarkan booking_id.
 * Hanya field target (berdasarkan status) yang akan di-update dengan timestamp baru
 * jika field tersebut masih null (belum pernah terisi).
 */
const updateVerificationTask = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { Executor, Executor_Names, status, loket } = req.body;

    // 1. Ambil data lama dari database
    const existingData = await VerificationTask.findById(booking_id);
    if (!existingData) {
      return res.status(404).json({ message: "Verification Task not found" });
    }

    // 2. Buat objek updatedData dengan mewarisi data lama
    const updatedData = {
      Executor: Executor !== undefined ? Executor : existingData.Executor,
      Executor_Names: Executor_Names !== undefined ? Executor_Names : existingData.Executor_Names,
      waiting_verification_stamp: existingData.waiting_verification_stamp,
      called_verification_stamp: existingData.called_verification_stamp,
      recalled_verification_stamp: existingData.recalled_verification_stamp,
      pending_verification_stamp: existingData.pending_verification_stamp,
      processed_verification_stamp: existingData.processed_verification_stamp,
      completed_verification_stamp: existingData.completed_verification_stamp,
      loket: loket !== undefined ? loket : existingData.loket,
    };

    // 3. Dapatkan timestamp saat ini dalam format MySQL "YYYY-MM-DD HH:mm:ss"
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log("VERIF NOW: ",now);
    // 4. Update hanya field target berdasarkan status baru jika nilainya masih null
    switch (status) {
      case "waiting_verification":
        if (!existingData.waiting_verification_stamp) {
          updatedData.waiting_verification_stamp = now;
        }
        break;
      case "called_verification":
        if (!existingData.called_verification_stamp) {
          updatedData.called_verification_stamp = now;
        }
        break;
      case "recalled_verification":
        if (!existingData.recalled_verification_stamp) {
          updatedData.recalled_verification_stamp = now;
        }
        break;
      case "pending_verification":
        if (!existingData.pending_verification_stamp) {
          updatedData.pending_verification_stamp = now;
        }
        break;
      case "processed_verification":
        if (!existingData.processed_verification_stamp) {
          updatedData.processed_verification_stamp = now;
        }
        break;
      case "completed_verification":
        if (!existingData.completed_verification_stamp) {
          updatedData.completed_verification_stamp = now;
        }
        break;
      default:
        // Jika status tidak dikenal, tidak ada field stamp yang diupdate
        break;
    }
    const io = req.app.get('socketio');

    // 5. Simpan perubahan ke database
    const result = await VerificationTask.update(booking_id, updatedData);
    io.emit('update_verification', {
      message: "Update Verification",
      data: result,
      status: status,
    });
    return res.status(200).json({
      message: "Verification Task updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating Verification Task:", error.message);
    return res.status(500).json({
      message: "Failed to update Verification Task",
      error: error.message
    });
  }
};

/**
 * Controller untuk menghapus Verification_Task berdasarkan booking_id.
 */
const deleteVerificationTask = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const result = await VerificationTask.delete(booking_id);
    const io = req.app.get('socketio');

    io.emit('delete_verification', {
      message: "Delete Verification",
      // data: result,
    });


    res.status(200).json({ message: 'Verification Task deleted successfully', data: result });
  } catch (error) {
    console.error('Error deleting Verification Task:', error.message);
    res.status(500).json({ message: 'Failed to delete Verification Task', error: error.message });
  }
};

module.exports = {
  createVerificationTask,
  createVerificationTaskInternal,
  getVerificationTaskById,
  getAllVerificationTasks,
  updateVerificationTask,
  deleteVerificationTask,
};
