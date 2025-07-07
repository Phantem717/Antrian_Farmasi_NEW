// src/controllers/medicineTaskController.js
const MedicineTask = require('../models/medicineTask');
// const io = req.app.get('socketio');
/**
 * Controller untuk membuat Medicine Task baru.
 */
const createMedicineTask = async (req, res) => {
  try {
    const data = req.body;
    console.log("MEDICINE",data);
    const result = await MedicineTask.create(data);
    const io = req.app.get('socketio');

    io.emit('create_medicine',{
      message: "medicine created",
      data: result,
    });

    res.status(201).json({ message: 'Medicine Task created successfully', data: result });
  } catch (error) {
    if(error.message.startsWith("Duplicate")){
      console.log("HIT");
          res.status(500).json({ message: 'Data Sudah Diproses', error: error.message });

    }else{
   console.error('Error creating Medicine Task:', error.message);
    res.status(500).json({ message: 'Failed to create Medicine Task', error: error.message });
    }
  }
};

/**
 * Controller untuk mengambil Medicine Task berdasarkan NOP.
 */
const getMedicineTaskByNOP = async (req, res) => {
  try {
    const { NOP } = req.params;
    const task = await MedicineTask.findByNOP(NOP);
    if (!task) {
      return res.status(404).json({ message: 'Medicine Task not found' });
    }
    res.status(200).json({ data: task });
  } catch (error) {
    console.error('Error retrieving Medicine Task:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Medicine Task', error: error.message });
  }
};

/**
 * Controller untuk mengambil semua Medicine Task.
 */
const getAllMedicineTasks = async (req, res) => {
  try {
    const tasks = await MedicineTask.getAll();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error('Error retrieving Medicine Tasks:', error.message);
    res.status(500).json({ message: 'Failed to retrieve Medicine Tasks', error: error.message });
  }
};

/**
 * Controller untuk memperbarui Medicine Task berdasarkan NOP.
 * Hanya field target (berdasarkan status) yang akan di-update dengan timestamp baru
 * jika field tersebut masih null (belum pernah terisi).
 */
// Fungsi updateMedicineTask (controller) tetap menggunakan fungsi internal di atas
const updateMedicineTask = async (req, res) => {
  try {
    const { NOP } = req.params;
    console.log("BODY",req.body);
    const { Executor, Executor_Names, status, loket } = req.body;
    const result = await updateMedicineTaskInternal(NOP, { Executor, Executor_Names, status, loket });
    const io = req.app.get('socketio');

    io.emit('create_medicine',{
      message: "medicine created",
      NOP:NOP,
      data: result,
    });

    return res.status(200).json({
      message: "Medicine Task updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Error updating Medicine Task:", error.message);
    return res.status(500).json({
      message: "Failed to update Medicine Task",
      error: error.message
    });
  }
};


/**
 * Controller untuk menghapus Medicine Task berdasarkan NOP.
 */
const deleteMedicineTask = async (req, res) => {
  try {
    const { NOP } = req.params;
    const result = await MedicineTask.delete(NOP);
    const io = req.app.get('socketio');

    io.emit('delete_medicine',{
      message: "medicine Deleted",
      // data: result,
    });

    res.status(200).json({ message: 'Medicine Task deleted successfully', data: result });
  } catch (error) {
    console.error('Error deleting Medicine Task:', error.message);
    res.status(500).json({ message: 'Failed to delete Medicine Task', error: error.message });
  }
};


// Tambahkan fungsi internal updateMedicineTaskInternal
const updateMedicineTaskInternal = async (NOP, updateData) => {
  // 1. Ambil data lama dari database
  const existingData = await MedicineTask.findByNOP(NOP);
  if (!existingData) {
    throw new Error("Medicine Task not found");
  }

  // 2. Susun objek updatedData dengan mewarisi data lama
  const updatedData = {
    Executor: updateData.Executor !== undefined ? updateData.Executor : existingData.Executor,
    Executor_Names: updateData.Executor_Names !== undefined ? updateData.Executor_Names : existingData.Executor_Names,
    waiting_medicine_stamp: existingData.waiting_medicine_stamp,
    called_medicine_stamp: existingData.called_medicine_stamp,
    recalled_medicine_stamp: existingData.recalled_medicine_stamp,
    pending_medicine_stamp: existingData.pending_medicine_stamp,
    processed_medicine_stamp: existingData.processed_medicine_stamp,
    completed_medicine_stamp: existingData.completed_medicine_stamp,
    loket: updateData.loket !== undefined ? updateData.loket : existingData.loket,
  };

  // 3. Dapatkan timestamp saat ini dalam format MySQL "YYYY-MM-DD HH:mm:ss"
  const nowUTC = new Date();
  const offsetMs = 7 * 60 * 60 * 1000; // UTC+7 in milliseconds
  const now = new Date(nowUTC.getTime() + offsetMs)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  
  // console.log(now); // ? WIB time
    console.log("NOW",now);
  // 4. Update field target berdasarkan updateData.status (hanya jika nilainya masih null)
  switch (updateData.status) {
    case "waiting_medicine":
      if (!existingData.waiting_medicine_stamp) {
        updatedData.waiting_medicine_stamp = now;
      }
      break;
    case "called_medicine":
      if (!existingData.called_medicine_stamp) {
        updatedData.called_medicine_stamp = now;
      }
      break;
    case "recalled_medicine":
      if (!existingData.recalled_medicine_stamp) {
        updatedData.recalled_medicine_stamp = now;
      }
      break;
    case "pending_medicine":
      if (!existingData.pending_medicine_stamp) {
        updatedData.pending_medicine_stamp = now;
      }
      break;
    case "processed_medicine":
      if (!existingData.processed_medicine_stamp) {
        updatedData.processed_medicine_stamp = now;
      }
      break;
    case "completed_medicine":
      if (!existingData.completed_medicine_stamp) {
        updatedData.completed_medicine_stamp = now;
        console.log("UPDATED MEDICINE",updateData.completed_medicine_stamp,now)
      }
      break;
    default:
      // Jika status tidak dikenal, tidak ada field timestamp yang diupdate
      break;
  }

  // 5. Simpan perubahan ke database dan kembalikan hasilnya
  const result = await MedicineTask.update(NOP, updatedData);
  return result;
};

module.exports = {
  createMedicineTask,
  getMedicineTaskByNOP,
  getAllMedicineTasks,
  updateMedicineTask,
  deleteMedicineTask,
  updateMedicineTaskInternal
};
