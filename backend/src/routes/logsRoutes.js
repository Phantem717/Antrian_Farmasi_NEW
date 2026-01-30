// src/routes/doctorAppointments.js
const express = require('express');
const router = express.Router();

const {
    getAllLogs,
    getTotalMedicineType,
    getAvgServiceTime,
    getDataPerHour,
    getLogsToday,
    getLogsByDate,
    getByPeriod,
    getAvgServiceTimeByDate,
    getDataPerHourByDate,
    getTotalMedicineTypeByDate
    
} = require('../controllers/logsController');
    
router.get('/', (req, res)=>{
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get All Logs'
    // #swagger.description = 'Get All Logs'
    getAllLogs(req, res)});
router.get('/by-date/:date/:category',(req,res)=>{getLogsByDate(
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    req,res)});
router.get('/service-time/:fromDate/:toDate/:category',(req,res)=>{
    
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'

    getAvgServiceTimeByDate(req,res)});
router.get('/data-per-hour/:fromDate/:toDate/:category',(req,res)=>{
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'

    getDataPerHourByDate(req,res)});
router.get('/total-medicine/:fromDate/:toDate/:category',(req,res)=>{
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getTotalMedicineTypeByDate(req,res)});
router.get('/total-medicine/:category',(req,res)=>{
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getTotalMedicineType(req,res)});
router.get('/service-time/:category',(req,res)=>{
    // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getAvgServiceTime(req,res)});
router.get('/data-per-hour/:category',(req,res)=>{
        // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getDataPerHour(req,res)});
router.get('/today/now/:category',(req,res)=>{
        // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getLogsToday(req,res)});
router.get('/period/:period/:category',(req,res)=>{
        // #swagger.tags = ['Logs']
    // #swagger.summary = 'Get By Date'
    // #swagger.description = 'Get All Task By Date'
    getByPeriod(req,res)});
module.exports = router;
