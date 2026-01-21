// src/routes/loketRoutes.js
const express = require('express');
const router = express.Router();

const {
  createLoket,
  getLoketById,
  getAllLokets,
  updateLoket,
  deleteLoket
} = require('../controllers/loketController');

router.post('/', createLoket);
router.get('/:loket_id', getLoketById);
router.get('/', getAllLokets);
router.put('/:loket_id', updateLoket);
router.delete('/:loket_id', deleteLoket);

module.exports = router;
