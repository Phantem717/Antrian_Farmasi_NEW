// src/routes/medicineTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createMedicineTask,
  getMedicineTaskById,
  getAllMedicineTasks,
  updateMedicineTask,
  deleteMedicineTask,
} = require('../controllers/medicineTaskController');

router.post('/', createMedicineTask);
router.get('/:booking_id', getMedicineTaskById);
router.get('/', getAllMedicineTasks);
router.put('/:booking_id', updateMedicineTask);
router.delete('/:booking_id', deleteMedicineTask);

module.exports = router;
