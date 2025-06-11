import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const BPJSBarcodeAPI = {
    // 1. Check Queue by Booking ID
    checkQueue: async (NOP) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/bpjs/barcode/check`, {
                params: { NOP: NOP },
            });

            // ✅ Ambil registration_no_client dari response API
            const registrationNo = response.data?.data?.detail?.registration_no_client || null;
            return { ...response.data, registrationNo };
        } catch (error) {
            console.error(`❌ Error checking queue for Booking ID ${NOP}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 2. Insert Queue and Process Data by Booking ID
    processQueueAndInsertData: async (NOP) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/bpjs/barcode/insert`, null, {
                params: { NOP: NOP }
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Error processing queue and inserting data for Booking ID ${NOP}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 3. Switch Medicine to Pickup by Booking ID
    switchMedicineToPickup: async (NOP) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/bpjs/barcode/update/`, + encodeURIComponent(NOP));
            return response.data;
        } catch (error) {
            console.error(`❌ Error switching medicine to pickup for Booking ID ${NOP}:`, error.response?.data || error.message);
            throw error;
        }
    },

    sendToWa: async (phone_number) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/bpjs/barcode/send`, {
                phone_number: phone_number,
                message: "??????????\nInformasi RS St Carolus Jakarta ?\n\nHallo Sahabat Sehat RS St Carolus Jakarta,\nDokter/Suster/Bapak/Ibu Lukas,\nKami informasikan bahwa untuk pelayanan WhatsApp Janji Temu dengan Dokter spesialis RS St Carolus Jakarta dapat menghubungi nomor di bawah ini:\n0811-1310-0742 ?\n\nUntuk nomor WhatsApp 0811-1050-5858 ? sudah tidak digunakan ??\n\nKami mohon maaf atas ketidaknyamanan pelayanan kami.\n\nTerima kasih dan salam sehat ????"
            });
    
            return response.data;
        } catch (error) {
            console.error("? Error sending WhatsApp message:", error.response?.data || error.message);
            throw error;
        }
    }
    
};

export default BPJSBarcodeAPI;
