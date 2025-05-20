// src/routes/pickupTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createPickupTask,
  getPickupTaskById,
  getAllPickupTasks,
  updatePickupTask,
  deletePickupTask,
} = require('../controllers/pickupTaskController');

router.post('/', createPickupTask);
router.get('/:booking_id', getPickupTaskById);
router.get('/', getAllPickupTasks);
router.put('/:booking_id', updatePickupTask);
router.delete('/:booking_id', deletePickupTask);

module.exports = router;
