const express = require('express');
const router = express.Router();

const {printFarmasiController} = require('../controllers/printController');
router.post('/',(req,res) => {
    // #swagger.tags = ['Print']
    // #swagger.summary = 'Print Farmasi'
    // #swagger.description = 'Print Farmasi'
    printFarmasiController(req,res)});

module.exports = router