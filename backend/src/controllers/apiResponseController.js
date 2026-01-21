// src/controllers/doctorAppointmentsController.js

const apiResponses = require('../models/apiResponses');
// const io = req.app.get('socketio');

/**
 * Controller untuk membuat appointment baru.
 */
const createApiResponse = async (req, res) => {
  try {
    const responseData = req.body;
    const result = await apiResponses.create(responseData);
    

    //PUT IN FRONTEND TO DISPLAY DATA
    // socket.on("new_doctor_appointment", (result) => {
    //   console.log("?? Got new booking from server!", result);
    // });
    

    res.status(201).json({ 
      message: 'Api Response created successfully', 
      data: result 
    });
  } catch (error) {
    console.error('Error creating API RESPONSE:', error);
    res.status(500).json({ 
      message: 'Failed to create API RESONSE', 
      error: error.message 
    });
  }
};

module.exports = {
  createApiResponse
};
