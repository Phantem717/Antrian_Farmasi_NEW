const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();
const { getCurrentTimestamp, convertToJakartaTime } = require('../handler/timeHandler');

const generateSignature = require('../utils/signature');
const password = process.env.PASSWORD ;
const consID2 = process.env.CONS_ID_WA;
const HOST = process.env.API_WA
const path = `http://${HOST}/api/v1/integration/whatsappweb/hello/send-text`
console.log("ENV",password,consID2,HOST,path);
async function sendWAVerif(payload){
    try {
      const { timestamp, signature } = generateSignature(consID2, password);
      let duration = "";
      let location = "";

      if(payload.location == "Lantai 1 BPJS"){
        location= "Kami dari Farmasi Rawat Jalan BPJS";
      }
      else if(payload.location == "Lantai 1 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 1";

      }
      else if(payload.location == "Lantai 3 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 3";

      }

      if (payload?.medicine_type?.trim() === "Racikan") {
        duration = "60 Menit"
      }
      else{
        duration = "30 Menit"

      }
      let change_queue_message;
      if(payload?.prev_queue_number?.trim() != "-" ){
        change_queue_message= `_Nomor Antrian anda telah berubah/diganti dari *${payload.prev_queue_number}* menjadi *${payload.queue_number}*_`
      }
  
      const currentTime = getCurrentTimestamp().split(' ')[1].substring(0, 2);
        let messageNext;
        console.log("TIMESTAMP",currentTime >= 20 ? true : false);
        console.log("PHONE_NUMBER_PICKUP",payload.phone_number);
        if(currentTime >= 20 == true ){
          messageNext= "Terima kasih telah menunggu, Karena sudah diluar jam kerja farmasi, obat anda dapat diambil di hari berikutnya pada jam 08.00-10.00."
        }
        else{
          messageNext = "Terima kasih telah menunggu."

        }
        const url = path;

    const response = await axios.post(
      url,
      {
phone: payload.phone_number,        // phone: payload.phone_number,
        message : `*Notifikasi Sistem Otomatis*

${messageNext}
${location} RS St. Carolus menginformasikan bahwa:    

Nama Pasien : *${payload.patient_name}*
No Registrasi : *${payload.NOP}*        
Dokter : *${payload.docter}*      
Obat : *${payload.medicine_type}*
No. Antrian : *${payload.queue_number}*
${change_queue_message ? '\n' + change_queue_message + '\n' : ''}
Saat ini sedang dilakukan *_Proses Penyiapan_* obat
Obat anda akan siap dalam +/- ${duration}.

*Maksimal Pengambilan Obat H+1 pada jam 08.00-12.00*

Mohon menunggu informasi selanjutnya. 
Terima kasih. 

*_pesan otomatis dari sistem, mohon tidak membalas_*`    },
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
        console.error('Error sending WhatsApp message Verification:', error.message);
        throw error;
    }
}

async function sendWAProses(payload){
    try {
        const { timestamp, signature } = generateSignature(consID2, password);
          let location = "";

      if(payload.location == "Lantai 1 BPJS"){
        location= "Kami dari Farmasi Rawat Jalan BPJS";
      }
      else if(payload.location == "Lantai 1 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 1";

      }
      else if(payload.location == "Lantai 3 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 3";

      }
    const url = path;
    const url_local = `http:/192.168.6.85/api/v1/integration/whatsappweb/hello/send-text`;
console.log("PHONE_NUMBER_PROSES",payload.phone_number,payload.switch_WA,"SWITCH TEST: ", payload.switch_WA ? payload.phone_number : "test");
    const response = await axios.post(
      url,
      {
phone: payload.phone_number,        // phone: payload.phone_number,

      message: `Notifikasi Sistem Otomatis

Terimakasih telah memilih RS St. Carolus sebagai Rumah Sakit pilihan anda.
${location} RS St. Carolus menginformasikan bahwa : 
    
Nama Pasien : *${payload.patient_name}*
No Registrasi : *${payload.NOP}*        
Dokter : *${payload.docter}*      
Obat : *${payload.medicine_type}*
No. Antrian : *${payload.queue_number}*

STATUS :
*3. OBAT SELESAI DIKEMAS*

Informasi Tambahan :

1. Pengambilan obat maksimal H+1 dari tanggal SEP/tanggal berobat, jika mengambil lewat dari H+1 maka obat tidak bisa diberikan
2. Pelayanan resep obat jadi memerlukan waktu kurang lebih 30 menit dan resep racikan 60 menit, namun lamanya waktu pelayanan ini bisa dipengaruhi oleh banyaknya resep yg masuk bersamaan dan banyaknya jumlah R/ dalam 1 resep
3. Penyiapan obat memerlukan ketelitian, dimohon kesabaran dalam menunggu. 
4. Jika memiliki hasil laboratorium mohon dapat dibawa dan diserahkan kepada petugas farmasi saat pengambilan obat
5. Pengambilan obat BPJS pada hari sebelumnya dapat dilayani pada hari Senin-Sabtu dimulai pukul 08.00-10.00
        `
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
        console.error('Error sending WhatsApp message Proses:', error.message);
        throw error;
    }
}

async function sendWAAntrian(payload){
    try {
        const { timestamp, signature } = generateSignature(consID2, password);
        let duration = "";
        let location = "";

      if(payload.location == "Lantai 1 BPJS"){
        location= "Kami dari Farmasi Rawat Jalan BPJS";
      }
      else if(payload.location == "Lantai 1 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 1";

      }
      else if(payload.location == "Lantai 3 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 3";

      }
        if (payload?.medicine_type?.trim() === "Racikan") {
          duration = "Obat anda akan siap dalam 60 menit"
        }
        else{
          duration = "Obat anda akan siap dalam 30 menit"

        }
    const url = path;
console.log("PHONE_NUMBER_ANTRIAN",payload.phone_number,payload.switch_WA,"SWITCH TEST: ", payload.switch_WA ? payload.phone_number : "test");
    const response = await axios.post(
      url,
      {
phone:payload.phone_number,        // phone: payload.phone_number,

        message : `
Notifikasi Sistem Otomatis

${location} RS St. Carolus menginformasikan bahwa :        

Nama Pasien : *${payload.patient_name}*
No Registrasi : *${payload.NOP}*        
Dokter : *${payload.docter}*      
Obat : *${payload.medicine_type}*
No. Antrian : *${payload.queue_number}*   

*Saat ini sedang dilakukan _Pengecekan Ketersediaan_ obatnya, apakah obat tersedia atau ada hal lain.*

Mohon menunggu informasi selanjutnya. 
*Maksimal Pengambilan Obat H+1 pada jam 08.00-12.00*
*Jika Pasien PRB atau OAT Silakan Menuju Ke Loket 2*

Terima kasih. 

*pesan otomatis dari sistem, mohon tidak membalas*

`    },
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
        console.error('Error sending WhatsApp message Antrian:', error.message);
        throw error;
    }
}

async function sendWAPickup(payload){
    try {
        const { timestamp, signature } = generateSignature(consID2, password);
        const currentTime = getCurrentTimestamp().split(' ')[1].substring(0, 2);
        let messageNext;
          let location = "";

      if(payload.location == "Lantai 1 BPJS"){
        location= "Kami dari Farmasi Rawat Jalan BPJS";
      }
      else if(payload.location == "Lantai 1 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 1";

      }
      else if(payload.location == "Lantai 3 GMCB"){
        location= "Kami dari Farmasi GMCB Lantai 3";

      }
        console.log("TIMESTAMP",currentTime >= 20 ? true : false);
        console.log("PHONE_NUMBER_PICKUP",payload.phone_number);
        if(currentTime >= 20 == true ){
          messageNext= "Terima kasih telah menunggu, Karena sudah diluar jam kerja farmasi, obat anda dapat diambil di hari berikutnya pada jam 08.00-10.00."
        }
        else{
          messageNext = "Terima kasih telah menunggu."

        }
        const url = path;

    const response = await axios.post(
      url,
      {
phone: payload.phone_number,        // phone: payload.phone_number,
        message : `*Notifikasi Sistem Otomatis*

${messageNext}
${location} RS St. Carolus menginformasikan bahwa :        

Nama Pasien : *${payload.patient_name}*
No Registrasi : *${payload.NOP}*        
Dokter : *${payload.docter}*      
Obat : *${payload.medicine_type}*
No. Antrian : *${payload.queue_number}*

*Saat ini _Obat Telah Selesai_ disiapkan, dan dapat diambil di ${payload.loket}.*

*Mohon menunjukkan WA ini untuk mengambil obat.*
*Maksimal Pengambilan Obat H+1 pada jam 08.00-12.00*


Terima kasih. 

*pesan otomatis dari sistem, mohon tidak membalas*`

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