// src/routes/verificationTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createVerificationTask,
  getVerificationTaskByNOP,
  getAllVerificationTasks,
  updateVerificationTask,
  deleteVerificationTask,
  getVerificationToday,
  getVerificationDate
} = require('../controllers/verificationTaskController');

router.post('/', createVerificationTask);
router.get('/:NOP', getVerificationTaskByNOP);
router.get('/', getAllVerificationTasks);
router.put('/:NOP', updateVerificationTask);
router.delete('/:NOP', deleteVerificationTask);
router.get('/now/today/:category',getVerificationToday);
router.get('/by-date/:date/:category',getVerificationDate);

module.exports = router;
