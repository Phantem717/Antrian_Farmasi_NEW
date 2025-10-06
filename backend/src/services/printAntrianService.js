const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();

const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_FARMASI;

async function printAntrianFarmasi(payload){
   let PRB= "";
 if(payload.PRB != null && !payload.PRB.includes("Potensi")){
  PRB = "PRB";
 }
 
    const templates = {
  umum: (payload) => ({
    judul: {
      judultext: `Farmasi ${payload.lokasi}`,
      queuenumber: payload.queue_number
    },
    content: {
      "Tanggal lahir": payload.tanggal_lahir,
      "Tipe Obat": payload.medicine_type,
      Nama: payload.patient_name,
      "Doctor Name": payload.doctor_name,
      "Kode Reservasi": payload.barcode,
      qrcodedata: payload.barcode
    },
    
    footer: {
      footer_info: "Melayani dari Hati membangkitkan harapan"
    }
  }),

  bpjs: (payload) => ({
    judul: {
      judultext: `Farmasi ${payload.lokasi}`,
      queuenumber: payload.queue_number
    },
    content: {
      "Tanggal lahir": payload.tanggal_lahir,
      "No SEP": payload.SEP,
      "Tipe Obat": payload.medicine_type,
      Nama: payload.patient_name,
      "Doctor Name": payload.doctor_name,
      "Kode Reservasi": payload.barcode,
      qrcodedata: payload.barcode
    },
    Note: {
      remarks_info: PRB
    },
    footer: {
      footer_info: "Melayani dari Hati membangkitkan harapan"
    }
  }),

  manual: (payload) => ({
    judul: {
      judultext: `Farmasi ${payload.lokasi}`,
      queuenumber: payload.queue_number
    },
    content: {
      "Kode Reservasi": payload.barcode,
      qrcodedata: payload.barcode
    },
   
    footer: {
      footer_info: "Melayani dari Hati membangkitkan harapan"
    }
  })
};

let htmlContent;

if(payload.lokasi == "Lantai 1 BPJS"){
  htmlContent = templates.bpjs(payload);
}

else{
  if(payload.queue_number.startsWith("RC") || payload.queue_number.startsWith("NR")){ 
  htmlContent = templates.umum(payload);
}

else{
  htmlContent = templates.manual(payload);
}
}
try {
    const { timestamp, signature } = generateSignature(consID2, password);
 const url = `http://192.168.6.86/api/v1/visit/queue/pharmacy/cetak`;
let message = "";
let urlprinter = "";
if(payload.lokasi == "Lantai 1 BPJS"){
if(payload.medicine_type == "Racikan" || payload.queue_number.startsWith("RC")){
 message = "Mohon Menunggu 30 menit sampai 1 jam Karena Obat Anda Adalah Racikan";
 urlprinter="172.16.31.4";
 }

 else if(payload.medicine_type.startsWith("Non")  || payload.queue_number.startsWith("NR")){
    message = "Mohon Menunggu Bentar Obat anda adalah Non - Racikan"
    urlprinter="172.16.26.78";

 }
 
 else{
    message = "Obat Anda Tidak Ada Resepnya"
        urlprinter="172.16.26.78";

 }
}
 

// console.log("PHONE_NUMBER",phone_number);
    const response = await axios.post(
      url,
      {
        printer: {
          printerIp: urlprinter,
          printerPort: 9100
        },
        htmlContent
        // htmlContent: {
        //   judul: {
        //     judultext: `Farmasi ${payload.lokasi}`,
        //     queuenumber: payload.queue_number
        //   },
        //   content: {
       
        //     "Tanggal lahir": payload.tanggal_lahir,
        //     "No SEP": payload.SEP,
        //     "Tipe Obat" : payload.medicine_type,
        //     Nama : payload.patient_name,
        //     "Doctor Name": payload.doctor_name,
        //     "Kode Reservasi" : payload.barcode,
        //     qrcodedata:payload.barcode,
        //   },
        //   Note: {
        //     remarks_info: PRB
        //   },
        //   footer: {
        //     footer_info: "Melayani dari Hati membangkitkan harapan"
        //   }
        // }
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

    console.log("ANRIAN RESPONSE:", response.data, urlprinter, payload.medicine_type, payload.NOP, payload.patient_name);
    return response.data;
} catch (error) {
    console.error('Error Printing:', error.message);
    throw error;
}
}

module.exports ={printAntrianFarmasi}