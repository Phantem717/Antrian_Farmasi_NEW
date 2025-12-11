const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();
const { getCurrentTimestamp, convertToJakartaTime } = require('../handler/timeHandler');

const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_WA;
const HOST = process.env.API_WA
const path = process.env.API_URL_WA;
const token = process.env.WA_TOKEN
console.log("ENV",password,consID2,HOST,path);
function base64encode(NOP){
  NOP = `"${NOP}"`
  return Buffer.from(NOP).toString('base64');

}
async function sendWAVerif(payload){
   let name;
   let templateId;
    try {
    if(payload.medicine_type == "Racikan"){
            name = "narasi_wa_farmasi_racikan_setelah_verifikasi"

      templateId="30628dfbcce54f77c7cf51b692fd1a5cUTILITY"
    }
    else{
            name = "narasi_wa_farmasi_resep_non_racikan_setelah_verifikasi"

      templateId="2b8e9a5b26be69dc796f00f80f0d4a0fUTILITY"
    }
    const url = path;
console.log("PHONE_NUMBER_ANTRIAN",payload.phone_number,payload.switch_WA,"SWITCH TEST: ", payload.switch_WA ? payload.phone_number : "test");
    const response = await axios.post(
      url,
     {
  name: name,
  channel: "cd4101061be0fe62f7606d992f1c7a31",
  templateId: templateId,
  sendingMode: "Now",
  content: [],
  headerVariables: [],
  bodyVariables: [
    {"type": "personalized","key": "{{1}}","value": "nama_pasien"},
    {"type": "personalized","key": "{{2}}","value": "no_registrasi"},
    {"type": "personalized","key": "{{3}}","value": "nama_dokter"},
    {"type": "personalized","key": "{{4}}","value": "no_antrian"},
    {"type": "personalized","key": "{{5}}","value": "link_cek_antrean"}
  ],
  whatsappRecipient: [
    {
      Recipient: payload.phone_number,
      nama_pasien: payload.patient_name,
      no_registrasi: payload.NOP,
      nama_dokter: payload.docter,
      no_antrian: payload.queue_number,
      link_cek_antrean: `https://antrean.rscarolus.or.id/farmasi/${base64encode(payload.NOP)}`
    }
  ]
},
      {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("WA RESPONSE:", response.data);
    return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message Antrian:', error.message);
        throw error;
    }
}

async function sendWAProses(payload){
 sendWAVerif(payload)
}

async function sendWAAntrian(payload){
  let name;
  let templateId;
    try {
    if(payload.medicine_type == "Racikan"){
      name = "narasi_wa_farmasi_racikan_masuk_2"
            templateId="d81ea494576090602152d84b6a56a34fUTILITY"

    }
    else{
      name = "narasi_wa_farmasi_resep_non_racikan"
            templateId="882b9bd6c012ce7a8a813faed8eef46bUTILITY"
    }
    const url = path;
console.log("PHONE_NUMBER_ANTRIAN",payload.phone_number,payload.switch_WA,"SWITCH TEST: ", payload.switch_WA ? payload.phone_number : "test");
    const response = await axios.post(
      url,
     {
  name: name,
  channel: "cd4101061be0fe62f7606d992f1c7a31",
  templateId: templateId,
  sendingMode: "Now",
  content: [],
  headerVariables: [],
  bodyVariables: [
    {"type": "personalized","key": "{{1}}","value": "nama_pasien"},
    {"type": "personalized","key": "{{2}}","value": "no_registrasi"},
    {"type": "personalized","key": "{{3}}","value": "nama_dokter"},
    {"type": "personalized","key": "{{4}}","value": "no_antrian"},
    {"type": "personalized","key": "{{5}}","value": "link_cek_antrean"}
  ],
  whatsappRecipient: [
    {
      Recipient: payload.phone_number,
      nama_pasien: payload.patient_name,
      no_registrasi: payload.NOP,
      nama_dokter: payload.docter,
      no_antrian: payload.queue_number,
      link_cek_antrean: `https://antrean.rscarolus.or.id/farmasi/${base64encode(payload.NOP)}`
    }
  ]
},
      {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("WA RESPONSE:", response.data);
    return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message Antrian:', error.message);
        throw error;
    }
}

async function sendWAPickup(payload){
    let name;
    let templateId;
    try {
    if(payload.medicine_type == "Racikan"){
            name = "narasi_wa_farmasi_racikan_selesai"

      templateId="1d410b2e1a87c5c2127829f8f3fb4090UTILITY"
    }
    else{
            name = "narasi_wa_farmasi_non_racikan_selesai"

      templateId="d8caf9ab44c42f5055bf6b3fe023414cUTILITY"
    }
    const url = path;
console.log("PHONE_NUMBER_ANTRIAN",payload.phone_number,payload.switch_WA,"SWITCH TEST: ", payload.switch_WA ? payload.phone_number : "test");
    const response = await axios.post(
      url,
     {
  name: name,
  channel: "cd4101061be0fe62f7606d992f1c7a31",
  templateId: templateId,
  sendingMode: "Now",
  content: [],
  headerVariables: [],
  bodyVariables: [
    {"type": "personalized","key": "{{1}}","value": "nama_pasien"},
    {"type": "personalized","key": "{{2}}","value": "no_registrasi"},
    {"type": "personalized","key": "{{3}}","value": "nama_dokter"},
    {"type": "personalized","key": "{{4}}","value": "no_antrian"},
    {"type": "personalized","key": "{{5}}","value": "link_cek_antrean"}
  ],
  whatsappRecipient: [
    {
      Recipient: payload.phone_number,
      nama_pasien: payload.patient_name,
      no_registrasi: payload.NOP,
      nama_dokter: payload.docter,
      no_antrian: payload.queue_number,
      link_cek_antrean: `https://antrean.rscarolus.or.id/farmasi/${base64encode(payload.NOP)}`
    }
  ]
},
      {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("WA RESPONSE:", response.data);
    return response.data;
    } catch (error) {
        console.error('Error sending WhatsApp message Antrian:', error.message);
        throw error;
    }
}

async function sendWACustom(payload){
    try {
        const { timestamp, signature } = generateSignature(consID2, password);
        const currentTime = getCurrentTimestamp().split(' ')[1].substring(0, 2);
        console.log("TIMESTAMP",currentTime >= 20 ? true : false);
        console.log("PHONE_NUMBER_PICKUP",payload.phone_number);
      
        const url = path;

    const response = await axios.post(
      url,
      {
phone: payload.phone_number,        // phone: payload.phone_number,
        message : payload.message

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
        console.error('Error sending WhatsApp message Pikcup:', error.message);
        throw error;
    }
}



module.exports = {sendWAProses,sendWAVerif,sendWAAntrian,sendWAPickup,sendWACustom}
