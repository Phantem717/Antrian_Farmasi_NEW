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
    let location = req.params.category
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
        const allLogs = await logs.getToday(location);
    console.log("location",location,allLogs);
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
    const {date,category} = req.params
    let location = category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
        const allLogs = await logsTask.getByDate(location,date);
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
    const {period,category} = req.params
     let location = category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
    const response = await logsTask.getByTimePeriod(location,period);
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
    let location = req.params.category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
    const totalMed = await logs.getTotalMedicineType(location);

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
    let location = req.params.category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
    const serviceTime = await logs.getAvgServiceTime(location);

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
    let location = req.params.category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
    const dataPerHour = await logs.getDataPerHour(location);

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

const getDataPerHourByDate = async (req,res)=>{
  try {
    const {fromDate,toDate,category} = req.params
    
    let location = category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
    console.log("DATE",fromDate,toDate,location);
    const dataPerHour = await logsTask.getDataPerHourByDate(fromDate,toDate,location);
    console.log("DATA PER HOUR",dataPerHour);
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

const getAvgServiceTimeByDate = async (req,res)=>{
  try {
    const {fromDate,toDate,category} = req.params
    let location = category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
        console.log("AVG APRAM",fromDate,toDate,location);

    const dataPerHour = await logsTask.getAvgServiceTimeByDate(fromDate,toDate,location);
    console.log("AVG SERVICE",dataPerHour);
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

const getTotalMedicineTypeByDate = async (req,res)=>{
  try {
    const {fromDate,toDate,category} = req.params
    let location = category;
    if(location == "bpjs"){location = "Lantai 1 BPJS"}
    if(location == "gmcb"){location = "Lantai 1 GMCB"}
    if(location == "lt3"){location = "Lantai 3 GMCB"}
        console.log("TYPE PARAM",fromDate,toDate,location);

    const dataPerHour = await logsTask.getTotalMedicineTypeByDate(fromDate,toDate,location);
    console.log("MEDICINE",dataPerHour);
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
 getByPeriod,
 getDataPerHourByDate,
 getAvgServiceTimeByDate,
 getTotalMedicineTypeByDate
};
