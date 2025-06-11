import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

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
