import axios from 'axios';

const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
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
     getAllLogsToday: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/today/now`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }
    },

    getLogsByDate: async (date) => {
        try {
             const response = await axios.get(`${BASE_URL}/api/logs/by-date/${encodeURIComponent(date)}`);
            console.log("VERIF",response.data);
            return response.data;
        } catch (error) {
             console.error('Error fetching all verification tasks:', error);
            throw error;
        }
    },

    getMedicineType : async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/total-medicine`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Type:', error);
            throw error;
        }
    },

    getDataPerHour : async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/data-per-hour`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    },

    getAvgServiceTime : async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/service-time`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    }


    

  
      
};

export default LogsAPI;
