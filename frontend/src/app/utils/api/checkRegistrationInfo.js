import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const CheckRegistrationInfo = {
    // 1. Check Queue by Booking ID
    checkQueue: async (registrationNo) => {
        console.log("NOP CHECK",registrationNo);
    
        try {
        const response = await axios.get(`${BASE_URL}/api/check/reg_no/${encodeURIComponent(registrationNo)}`)         
        return response.data ;
        } catch (error) {
            console.error(`❌ Error checking queue for Booking ID ${registrationNo}:`, error.response?.data || error.message);
            throw error;
        }
    },
    checkQueueSEP: async (sepNo) => {
         try {
const response = await axios.get(`${BASE_URL}/api/check/${encodeURIComponent(sepNo)}`)         
 return response.data ;
        } catch (error) {
            console.error(`❌ Error checking queue for Booking ID ${sepNo}:`, error.response?.data || error.message);
            throw error;
        }
    },

 checkQueueERM: async (name, mr_no) => {
    try {
        // ✅ CORRECTION 2: Use axios.get and params for query parameters
        const response = await axios.get(`${BASE_URL}/api/check`, {
            params: { name, mr_no } // Data is correctly sent as query parameters
        });
        return response.data;
    } catch (error) {
        console.error(`❌ Error checking queue for Booking ID ${name} ${mr_no}:`, error.response?.data || error.message);
        throw error;
    }
}

 
    
};

export default CheckRegistrationInfo;
