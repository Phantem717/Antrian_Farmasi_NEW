import axios from 'axios';



const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const RetrieveList = {
    // 1. Check Queue by Booking ID
   
    retrieveList: async () => {
        try {
            const response = await axios.post(`${BASE_URL}/api/retrieve`, {
               
            });
    
            return response.data;
        } catch (error) {
            console.error("? Error sending WhatsApp message:", error.response?.data || error.message);
            throw error;
        }
    }
    
};

export default RetrieveList;
