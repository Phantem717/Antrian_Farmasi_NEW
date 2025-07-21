const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();

const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_FARMASI;

async function createAntrianFarmasi(medicine_type){
    
try {
 
    const { timestamp, signature } = generateSignature(consID2, password);
 const url = `https://rscarolus.com/api/v1/visit/queue/pharmacy/create-queue`;
 console.log("medicine_type",medicine_type)
// console.log("PHONE_NUMBER",phone_number);
    const response = await axios.post(
      url,
      {
        queue: {
            sub_facility: medicine_type, 
            location_id: "farmasi-bpjs"
        }
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
    console.error('Error Printing:', error.message);
    throw error;
}
}

module.exports ={createAntrianFarmasi}