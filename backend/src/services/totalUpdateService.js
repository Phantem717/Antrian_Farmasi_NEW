const axios = require('axios');
require('dotenv').config({ path: './.env' });
const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD;
const consID2 = process.env.CONS_ID_FARMASI;
const apiKey = process.env.X_API_KEY;
const checkRegistrationInfo = require('../services/checkRegistrationInfo')
async function getTotal(registrationNo) {
  console.log("REG", registrationNo,consID2);
  if (!registrationNo) {
    console.error("⚠ Missing registration number");
    return null;
  }

  try {
    const { timestamp, signature } = generateSignature(consID2, password);
    const url = `http://192.168.6.86/api/v1/visit/queue/pharmacy/compound-info`;
  } catch (error) {
    if (error.response) {
      console.error("Error QUEUE:", error.response.status, error.response.data);
    } else {
      console.error("Error QUEUE:", error.message);
    }
    throw error;
  }
}

module.exports = { getTotal };
