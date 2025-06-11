// src/routes/pickupTaskRoutes.js
const express = require('express');
const router = express.Router();

const {
  createPickupTask,
  getPickupTaskByNOP,
  getAllPickupTasks,
  updatePickupTask,
  deletePickupTask,
} = require('../controllers/pickupTaskController');

router.post('/', createPickupTask);
router.get('/:NOP', getPickupTaskByNOP);
router.get('/', getAllPickupTasks);
router.put('/:NOP', updatePickupTask);
router.delete('/:NOP', deletePickupTask);

module.exports = router;
