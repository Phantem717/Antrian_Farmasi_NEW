// src/controllers/doctorAppointmentsController.js

const logsTask = require('../models/logsTask');
const logs = require('../models/logsTask');
const { all } = require('../routes/verificationTaskRoutes');

/**
 * Controller untuk mengambil semua logs dari berbagai task.
 */
const getAllLogs = async (req, res) => {
  try {
    const allLogs = await logs.getAll();

    res.status(200).json({ 
      message: "List of all Logs",
      data: allLogs
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
};

const getLogsToday = async (req,res)=>{
  try {
        const allLogs = await logs.getToday();

    res.status(200).json({ 
      message: "List of all Logs",
      data: allLogs
    });
  } catch (error) {
     console.error("Error fetching logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
}


const getLogsByDate = async (req,res)=>{
  try {
    const {date} = req.params
        const allLogs = await logsTask.getByDate(date);
        if(!allLogs){
          return res.status(404).json({message: "Log Not Found"})
        }

    res.status(200).json({ 
      message: "List of all Logs",
      data: allLogs
    });
  } catch (error) {
     console.error("Error fetching logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
}
const getByPeriod = async (req,res) => {
  try {
    const {period} = req.params
    const response = await logsTask.getByTimePeriod(period);
    console.log("FILTER",response);
    if(!response){
       return res.status(404).json({ 
      message: "Logs Not Found", 
      error: error.message 
    });
  }

     res.status(200).json({
      data: response
    });
    
  } catch (error) {
      console.error("Error fetching logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
}
const getTotalMedicineType = async (req, res) => {
  try {
    const totalMed = await logs.getTotalMedicineType();

    res.status(200).json({ 
      message: "Total Medicine",
      data: totalMed
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
};
const getAvgServiceTime = async (req, res) => {
  try {
    const serviceTime = await logs.getAvgServiceTime();

    res.status(200).json({ 
      message: "Total Service Time",
      data: serviceTime
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
};

const getDataPerHour = async (req,res)=>{
  try {
    const dataPerHour = await logs.getDataPerHour();

    res.status(200).json({ 
      message: "Total Data Per Hour",
      data: dataPerHour
    });
  } catch (error) {
    console.error("Error fetching hour logs:", error);
    res.status(500).json({ 
      message: "Failed to fetch logs", 
      error: error.message 
    });
  }
}

module.exports = {
  getAllLogs,
  getTotalMedicineType,
  getAvgServiceTime,
  getDataPerHour,
 getLogsToday,
 getLogsByDate,
 getByPeriod
};
