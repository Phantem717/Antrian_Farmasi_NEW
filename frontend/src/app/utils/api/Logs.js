import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const LogsAPI = {
    // 1. Get All Appointments
    getAllLogs: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }
    },

  
      
};

export default LogsAPI;
