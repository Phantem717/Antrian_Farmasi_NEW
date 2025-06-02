import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const apiResponsesAPI = {
    // 1. Get All Appointments
   

    // 3. Create New Appointment
    createApiResponse: async (reponseData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/APIResponse`, reponseData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

      
};

export default apiResponsesAPI;
