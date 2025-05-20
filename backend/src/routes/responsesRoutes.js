// src/routes/responsesRoutes.js
const express = require('express');
const router = express.Router();
// const controller = require('../controllers/responseController');
// console.log("Controller exports:", controller);

const {
  getAllResponses,
} = require('../controllers/responsesController');

router.get('/:location', getAllResponses);

module.exports = router;
