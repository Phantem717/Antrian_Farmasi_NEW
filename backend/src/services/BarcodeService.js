// src/services/medappService.js
const axios = require('axios');
require('dotenv').config()

const generateSignature = require('../utils/signature');
// const sendWA = require('../services/sendWAService');


// Ambil nilai dari environment variables
const baseUrl = process.env.BASE_URL || "https://app-medapp.eksad.com";   // BASE_URL, bukan BASE-URL atau base_url
const apiKey = process.env.X_API_KEY || "3af91c651c18b69f37413798ec0f3eee";   // X_API_KEY, bukan X-API-KEY

/**
 * Memanggil API untuk mengecek queue berdasarkan booking_id.
 * @param {string} bookingId - ID booking yang ingin dicek.
 * @returns {Promise<Object>} - Response data dari API.
 */

const medinUrl = process.env.MEDIN_URL || "http://192.168.6.85/api/medinfras/compound-info";
const apiKeyMedin = process.env.X_API_KEY_MEDIN || "AMqey0yAVrqmhR82RMlWB3zqMpvRP0zaaOheEeq2tmmcEtRYNj2";
const consID = process.env.CONS_ID || "21011919";
const SecretKey = process.env.SECRETKEY || "BeatoCarloAcutis";
const password = "e6a637643ca02f19580e14895664d470";
const consID2 = "39205596";
async function checkQueue(bookingId) {
  try {
    if(bookingId.startsWith("FA")){
      return true;
    }
    else{
      const { timestamp, signature } = generateSignature(consID2, password);

      const url = `https://rscarolus.com/api/v1/visit/queue/pharmacy/check`;
      const response = await axios.get(url, {
        params: { booking_id: bookingId },
        headers:
         { 'X-cons-id': consID2,
           'X-timestamp': timestamp,
           'X-signature': signature
         }
      });
      console.log("REG DATA2",response.data);

      return response.data;
    }
   
  } catch (error) {
    console.error('Error calling checkQueue API:', error.message);
    throw error;
  }
}

async function sendToWA(phone_number) {
  try {
    const { timestamp, signature } = generateSignature(consID2, password);

    const url = `https://rscarolus.com/api/v1/integration/whatsappweb/hello/send-text`;
console.log("PHONE_NUMBER",phone_number);
    const response = await axios.post(
      url,
      {
        phone: phone_number,
        message: "??????????\nInformasi RS St Carolus Jakarta ?\n\nHallo Sahabat Sehat RS St Carolus Jakarta,\nDokter/Suster/Bapak/Ibu Lukas,\nKami informasikan bahwa untuk pelayanan WhatsApp Janji Temu dengan Dokter spesialis RS St Carolus Jakarta dapat menghubungi nomor di bawah ini:\n0811-1310-0742 ?\n\nUntuk nomor WhatsApp 0811-1050-5858 ? sudah tidak digunakan ??\n\nKami mohon maaf atas ketidaknyamanan pelayanan kami.\n\nTerima kasih dan salam sehat ????"
      },
      {
        headers: {
          'X-cons-id': consID2,
          'X-timestamp': timestamp,
          'X-signature': signature,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("WA RESPONSE:", response.data);
    return response.data;

  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw error;
  }
}


async function fetchRegistrationData(registrationNo) {
  const { timestamp, signature } = generateSignature(consID, SecretKey);
  try {
    const response = await axios.post(medinUrl, { registrationNo }, {
      headers: {
        'X-Access-Token': apiKeyMedin,
        'X-Cons-Id': consID,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Content-Type': 'application/json'
      }
    });
    console.log("REG DATA",response.data);
    return response.data;
  } catch (error) {
    console.error('Error dalam pemanggilan API:', error);
    throw error;
  }
}

module.exports = { checkQueue,fetchRegistrationData,sendToWA  };
