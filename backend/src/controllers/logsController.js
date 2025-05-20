// src/controllers/doctorAppointmentsController.js

const logs = require('../models/logsTask');

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

module.exports = {
  getAllLogs,
};
