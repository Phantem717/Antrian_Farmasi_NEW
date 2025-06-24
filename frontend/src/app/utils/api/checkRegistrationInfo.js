import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const CheckRegistrationInfo = {
    // 1. Check Queue by Booking ID
    checkQueue: async (registrationNo) => {
        console.log("NOP CHECK",registrationNo);
    
        try {
const response = await axios.get(`${BASE_URL}/api/check/${encodeURIComponent(registrationNo)}`)         
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
    }

 
    
};

export default CheckRegistrationInfo;
