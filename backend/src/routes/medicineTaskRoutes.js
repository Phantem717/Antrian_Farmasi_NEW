// src/routes/medicineTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createMedicineTask,
  getMedicineTaskByNOP,
  getAllMedicineTasks,
  updateMedicineTask,
  deleteMedicineTask,
} = require('../controllers/medicineTaskController');

router.post('/', createMedicineTask);
router.get('/:NOP', getMedicineTaskByNOP);
router.get('/', getAllMedicineTasks);
router.put('/:NOP', updateMedicineTask);
router.delete('/:NOP', deleteMedicineTask);

module.exports = router;
