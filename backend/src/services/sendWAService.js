const axios = require('axios');
require('dotenv').config()

const generateSignature = require('../utils/signature');
const password = "e6a637643ca02f19580e14895664d470";
const consID2 = "39205596";

async function sendWAVerif(payload){
    try {
        const { timestamp, signature } = generateSignature(consID2, password);

    const url = `https://rscarolus.com/api/v1/integration/whatsappweb/hello/send-text`;
// console.log("PHONE_NUMBER",payload.phone_number);
    const response = await axios.post(
      url,
      {
        phone: "081286968913",
        // phone: payload.phone_number,
        // phone: payload.phone_number,

        message: `Notifikasi Sistem Otomatis

Terimakasih telah memilih RS St. Carolus sebagai Rumah Sakit pilihan anda.
Kami dari Farmasi Rawat Jalan BPJS RS St. Carolus menginformasikan bahwa : 

Nama Pasien : ${payload.patient_name}
No SEP: ${payload.sep}
NIK: ${payload.nik}
Dokter : ${payload.docter}
Nomor RM : ${payload.rm} 
OBAT ${payload.medicine_type}

STATUS :
*2. RESEP SEDANG DIKERJAKAN*

Informasi Tambahan :

1. Pengambilan obat maksimal H+1 dari tanggal SEP/tanggal berobat, jika mengambil lewat dari H+1 maka obat tidak bisa diberikan
2. Penyiapan obat memerlukan ketelitian, dimohon kesabaran dalam menunggu
3. Jika obat racikan, akan memerlukan waktu yang lebih lama dalam penyiapannya
4. Jika memiliki hasil laboratorium mohon dapat dibawa dan diserahkan kepada petugas farmasi saat pengambilan obat
5. Pengambilan obat BPJS pada hari sebelumnya dapat dilayani pada hari Senin-Sabtu dimulai pukul 08.00-10.00`
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
        console.error('Error sending WhatsApp message Verification:', error.message);
        throw error;
    }
}

async function sendWAProses(payload){
    try {
        const { timestamp, signature } = generateSignature(consID2, password);

    const url = `https://rscarolus.com/api/v1/integration/whatsappweb/hello/send-text`;
    const url_local = `http:/192.168.6.85/api/v1/integration/whatsappweb/hello/send-text`;
console.log("PHONE_NUMBER",payload.phone_number);
    const response = await axios.post(
      url,
      {
        phone: "081286968913",
        // phone: payload.phone_number,

      message: `Notifikasi Sistem Otomatis

Terimakasih telah memilih RS St. Carolus sebagai Rumah Sakit pilihan anda.
Kami dari Farmasi Rawat Jalan BPJS RS St. Carolus menginformasikan bahwa : 
        
Nama Pasien : ${payload.patient_name}
No SEP: ${payload.sep}
NIK: ${payload.nik}
Dokter : ${payload.docter}
Nomor RM : ${payload.rm} 
OBAT ${payload.medicine_type}
        
STATUS :
*3. OBAT SUDAH SELESAI DISIAPKAN*
        
Informasi Tambahan :
        
1. Pengambilan obat maksimal H+1 dari tanggal SEP/tanggal berobat, jika mengambil lewat dari H+1 maka obat tidak bisa diberikan
2. Penyiapan obat memerlukan ketelitian, dimohon kesabaran dalam menunggu
3. Jika obat racikan, akan memerlukan waktu yang lebih lama dalam penyiapannya
4. Jika memiliki hasil laboratorium mohon dapat dibawa dan diserahkan kepada petugas farmasi saat pengambilan obat
5. Pengambilan obat BPJS pada hari sebelumnya dapat dilayani pada hari Senin-Sabtu dimulai pukul 08.00-10.00`
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

    const url = `https://rscarolus.com/api/v1/integration/whatsappweb/hello/send-text`;
console.log("PHONE_NUMBER",payload.phone_number);
    const response = await axios.post(
      url,
      {
        phone: "081286968913",
        // phone: payload.phone_number,

        message : `Notifikasi Sistem Otomatis
Terimakasih telah memilih RS St. Carolus sebagai Rumah Sakit pilihan Anda.
Kami dari Farmasi Rawat Jalan BPJS RS St. Carolus menginformasikan bahwa:
        
Nama Pasien : ${payload.patient_name}
No SEP      : ${payload.sep}
NIK         : ${payload.nik}
Dokter      : ${payload.docter}
Nomor RM    : ${payload.rm}
OBAT        : ${payload.medicine_type}
        
STATUS:
*1. RESEP SUDAH MASUK DALAM ANTRIAN FARMASI*
        
Informasi Tambahan:
        
1. Pengambilan obat maksimal H+1 dari tanggal SEP/tanggal berobat, jika mengambil lewat dari H+1 maka obat tidak bisa diberikan
2. Penyiapan obat memerlukan ketelitian, dimohon kesabaran dalam menunggu
3. Jika obat racikan, akan memerlukan waktu yang lebih lama dalam penyiapannya
4. Jika memiliki hasil laboratorium, mohon dapat dibawa dan diserahkan kepada petugas farmasi saat pengambilan obat
5. Pengambilan obat BPJS pada hari sebelumnya dapat dilayani pada hari Senin–Sabtu, pukul 08.00–10.00`    },
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

    const url = `https://rscarolus.com/api/v1/integration/whatsappweb/hello/send-text`;
console.log("PHONE_NUMBER_PICKUP",payload.phone_number);
    const response = await axios.post(
      url,
      {
        phone: "081286968913",
        // phone: payload.phone_number,
        message : `Notifikasi Sistem Otomatis

Terimakasih telah memilih RS St. Carolus sebagai Rumah Sakit pilihan Anda.
Kami dari Farmasi Rawat Jalan BPJS RS St. Carolus menginformasikan bahwa:

Nama Pasien : ${payload.patient_name}
No SEP      : ${payload.sep}
NIK         : ${payload.nik}
Dokter      : ${payload.docter}
Nomor RM    : ${payload.rm}
OBAT        : ${payload.medicine_type}

STATUS:
*4. OBAT SIAP DISERAHKAN*

Informasi Tambahan:

1. Pengambilan obat maksimal H+1 dari tanggal SEP/tanggal berobat, jika mengambil lewat dari H+1 maka obat tidak bisa diberikan
2. Penyiapan obat memerlukan ketelitian, dimohon kesabaran dalam menunggu
3. Jika obat racikan, akan memerlukan waktu yang lebih lama dalam penyiapannya
4. Jika memiliki hasil laboratorium, mohon dapat dibawa dan diserahkan kepada petugas farmasi saat pengambilan obat
5. Pengambilan obat BPJS pada hari sebelumnya dapat dilayani pada hari Senin–Sabtu, pukul 08.00–10.00`

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

module.exports = {sendWAProses,sendWAVerif,sendWAAntrian,sendWAPickup}