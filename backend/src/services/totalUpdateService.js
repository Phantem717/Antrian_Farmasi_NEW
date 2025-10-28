const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();

const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_FARMASI;

async function getTotal(registrationNo){
    
try {
 
    const { timestamp, signature } = generateSignature(consID2, password);
 const url = `http://192.168.6.86/api/v1/visit/queue/pharmacy/compound-info`;
 console.log("medicine_type",medicine_type,lokasi)
// console.log("PHONE_NUMBER",phone_number);
    const response = await axios.post(
      url,
      {
        registrationNo
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

    console.log("ANRIAN RESPONSE:", response.data);
    return response.data;
} catch (error) {
    console.error('Error QUEUE:', error.message);
    throw error;
}
}

module.exports ={getTotal}