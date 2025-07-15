const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();

const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_FARMASI;

async function printAntrianFarmasi(payload){
    
try {
    const { timestamp, signature } = generateSignature(consID2, password);
 const url = `https://rscarolus.com/api/v1/visit/queue/pharmacy/cetak`;
let message = "";
let urlprinter = "";
 if(payload.medicine_type == "Racikan" || payload.medicine_type == "racikan" || payload.queue_number.startsWith("RC")){
 message = "Mohon Menunggu 30 menit sampai 1 jam Karena Obat Anda Adalah Racikan";
 urlprinter="172.16.31.4";
 }

 else if(payload.medicine_type == "Non - Racikan" || payload.medicine_type == "nonracikan"  || payload.queue_number.startsWith("NR")){
    message = "Mohon Menunggu Bentar Obat anda adalah Non - Racikan"
    urlprinter="172.16.26.78";

 }
 
 else{
    message = "Obat Anda Tidak Ada Resepnya"
        urlprinter="172.16.26.78";

 }
 let PRB= "";
 if(payload.PRB != null && !payload.PRB.includes("Potensi")){
  PRB = "PRB";
 }
 
// console.log("PHONE_NUMBER",phone_number);
    const response = await axios.post(
      url,
      {
        printer: {
          printerIp: urlprinter,
          printerPort: 9100
        },
        htmlContent: {
          judul: {
            judultext: "Farmasi BPJS",
            queuenumber: payload.queue_number
          },
          content: {
            // nama: payload.patient_name,
            // no_telp: payload.phone_number,
            // id: payload.farmasi_queue_number,
            // qrcodedata:payload.barcode
            // "Antrian Farmasi": payload.farmasi_queue_number,
            "Tanggal lahir": payload.tanggal_lahir,
            "No SEP": payload.SEP,
            "Tipe Obat" : payload.medicine_type,
            Nama : payload.patient_name,
            // "No Antrian" : payload.queue_number,
            "Kode Reservasi" : payload.barcode,
            qrcodedata:payload.barcode,
    //   base64Barcode: payload.barcode
          },
          Note: {
            remarks_info: PRB
          },
          footer: {
            footer_info: "Melayani dari Hati membangkitkan harapan"
          }
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

    console.log("ANRIAN RESPONSE:", response.data, urlprinter, payload.medicine_type);
    return response.data;
} catch (error) {
    console.error('Error Printing:', error.message);
    throw error;
}
}

module.exports ={printAntrianFarmasi}