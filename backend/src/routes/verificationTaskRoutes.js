// src/routes/verificationTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createVerificationTask,
  getVerificationTaskById,
  getAllVerificationTasks,
  updateVerificationTask,
  deleteVerificationTask,
} = require('../controllers/verificationTaskController');

router.post('/', createVerificationTask);
router.get('/:booking_id', getVerificationTaskById);
router.get('/', getAllVerificationTasks);
router.put('/:booking_id', updateVerificationTask);
router.delete('/:booking_id', deleteVerificationTask);

module.exports = router;
