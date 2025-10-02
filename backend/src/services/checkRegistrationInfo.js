// src/services/medappService.js
const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();
const decryptor = require('../utils/decryptor');
const generateSignature = require('../utils/signature');
// const sendWA = require('../services/sendWAService');

const {create} = require('../models/apiResponses')
// Ambil nilai dari environment variables
const baseUrl = process.env.BASE_URL || "https://app-medapp.eksad.com";   // BASE_URL, bukan BASE-URL atau base_url
const apiKey = process.env.X_API_KEY ;   // X_API_KEY, bukan X-API-KEY

/**
 * Memanggil API untuk mengecek queue berdasarkan booking_id.
 * @param {string} NOP - ID booking yang ingin dicek.
 * @returns {Promise<Object>} - Response data dari API.
 */

const medinUrl = process.env.MEDIN_URL ;
const apiKeyMedin = process.env.X_API_KEY_MEDIN ;
const consID = process.env.CONS_ID;
const SecretKey = process.env.SECRETKEY;
const  consID2= process.env.CONS_ID_FARMASI;
const password = process.env.PASSWORD;

async function checkRegistrationInfo(registrationNo) {
  console.log("REGISTRATION NO", registrationNo);
  const { timestamp, signature } = generateSignature(consID2, password);
  // regisNo = registrationNo.trim();
  try {
    const response = await axios({
      method: 'get',
      url: process.env.MEDIN_URL2,
      data: { registrationNo: registrationNo }, // Body for GET
      headers: {
        'X-cons-id': process.env.CONS_ID_FARMASI,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    const payload = {
      response: response.data,
      response_type: "Medicine_Type",
    }
    const headers = {
        consId : consID2,
        timestamp : timestamp
    }
    console.log("RESPONSE",headers,response.data);
 const decryptedData = decryptor.runDecryption(response.data,headers // Crucial for getting the timestamp
    );
    console.log("REG DATA",decryptedData);
    return decryptedData;
  } catch (error) {
    console.error('Error dalam pemanggilan API:', error);
    throw error;
  }
}


async function checkRegistrationSEP(SEP) {
  console.log("SEP", SEP);
  const { timestamp, signature } = generateSignature(consID2, password);
  // regisNo = SEP.trim();
  try {
    const response = await axios({
      method: 'get',
      url: process.env.MEDIN_URL2,
      data: { sepNo: SEP }, // Body for GET
      headers: {
        'X-cons-id': process.env.CONS_ID_FARMASI,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    const payload = {
      response: response.data,
      response_type: "Medicine_Type",
    }
   const headers = {
        consId : consID2,
        timestamp : timestamp
    }
    console.log("RESPONSE",headers,response.data);
 const decryptedData = decryptor.runDecryption(response.data,headers // Crucial for getting the timestamp
    );
    console.log("REG DATA",decryptedData);
    return decryptedData;
  } catch (error) {
    console.error('Error dalam pemanggilan API:', error);
    throw error;
  }
}



async function checkRegistrationERM(name,mr_no) {
  const { timestamp, signature } = generateSignature(consID2, password);
  // regisNo = SEP.trim();
  try {
    const response = await axios({
      method: 'get',
      url: process.env.MEDIN_URL_GMCB,
      params: { name: name, mr_no: mr_no },
      headers: {
        'X-cons-id': process.env.CONS_ID_FARMASI,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
 
    return response.data;
  } catch (error) {
    console.error('Error dalam pemanggilan API:', error);
    throw error;
  }
}

module.exports = { checkRegistrationInfo,checkRegistrationSEP,checkRegistrationERM };
