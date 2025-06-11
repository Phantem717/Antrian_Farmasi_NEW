// src/routes/verificationTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createVerificationTask,
  getVerificationTaskByNOP,
  getAllVerificationTasks,
  updateVerificationTask,
  deleteVerificationTask,
} = require('../controllers/verificationTaskController');

router.post('/', createVerificationTask);
router.get('/:NOP', getVerificationTaskByNOP);
router.get('/', getAllVerificationTasks);
router.put('/:NOP', updateVerificationTask);
router.delete('/:NOP', deleteVerificationTask);

module.exports = router;
