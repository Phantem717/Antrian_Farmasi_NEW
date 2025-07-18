import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const PrintAntrian = {
    // 1. Check Queue by Booking ID
   
    printAntrian: async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/print`,payload);
    
            return response.data;
        } catch (error) {

            console.error("? Error sending Printing:", error.response?.data || error.message);
            throw error;
            
        }

    }
    
};

export default PrintAntrian;
