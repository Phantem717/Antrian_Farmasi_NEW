import axios from 'axios';

const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API

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
