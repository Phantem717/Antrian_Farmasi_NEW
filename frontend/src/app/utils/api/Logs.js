import axios from 'axios';
import { get } from 'jquery';

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
     getAllLogsToday: async (location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/today/now/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }
    },
    getByPeriod: async (location,period) => {
try {
  
     const response = await axios.get(`${BASE_URL}/api/logs/period/${encodeURIComponent(period)}/${location}`);
     console.log("RESP PERIOD",response);
            return response.data;
} catch (error) {
     console.error('Error fetching all appointments:', error);
    throw error;
}
    },

    getLogsByDate: async (location,date) => {
        try {
             const response = await axios.get(`${BASE_URL}/api/logs/by-date/${encodeURIComponent(date)}/${location}`);
            console.log("VERIF",response.data);
            return response.data;
        } catch (error) {
             console.error('Error fetching all verification tasks:', error);
            throw error;
        }
    },

    getMedicineType : async (location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/total-medicine/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Type:', error);
            throw error;
        }
    },

    getDataPerHour : async (location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/data-per-hour/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    },

    getAvgServiceTime : async (location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/service-time/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    },

    getAvgServiceTimeByDate : async (fromDate,toDate,location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/service-time/${encodeURIComponent(fromDate)}/${encodeURIComponent(toDate)}/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    },

    getDataPerHourByDate : async (fromDate,toDate,location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/data-per-hour/${encodeURIComponent(fromDate)}/${encodeURIComponent(toDate)}/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    },

    getTotalMedicineTypeByDate : async (fromDate,toDate,location) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/logs/total-medicine/${encodeURIComponent(fromDate)}/${encodeURIComponent(toDate)}/${location}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching Data Per Hour:', error);
            throw error;
        }
    },


    

  
      
};

export default LogsAPI;
