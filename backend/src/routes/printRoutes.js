const express = require('express');
const router = express.Router();

const {printFarmasiController} = require('../controllers/printController');
router.post('/',printFarmasiController);

module.exports = router