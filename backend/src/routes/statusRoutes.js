// src/routes/responsesRoutes.js
const express = require('express');
const router = express.Router();
// const controller = require('../controllers/responseController');
// console.log("Controller exports:", controller);

const {
getStatus
} = require('../controllers/statusController');

router.get('/', getAllResponses);


module.exports = router;
