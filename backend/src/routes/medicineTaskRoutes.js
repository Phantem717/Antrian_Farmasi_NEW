// src/routes/medicineTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createMedicineTask,
  getMedicineTaskByNOP,
  getAllMedicineTasks,
  updateMedicineTask,
  deleteMedicineTask,
  getAllMedicineByDate,
  getMedicineToday
} = require('../controllers/medicineTaskController');

router.post('/', createMedicineTask);
router.get('/:NOP', getMedicineTaskByNOP);
router.get('/', getAllMedicineTasks);
router.put('/:NOP', updateMedicineTask);
router.delete('/:NOP', deleteMedicineTask);
router.get('/today/now/:category',getMedicineToday);
router.get('/by-date/:date/:category',getAllMedicineByDate);

module.exports = router;
