import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

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
