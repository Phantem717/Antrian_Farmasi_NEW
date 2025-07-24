//src\app\utils\api\Verification.js
import axios from 'axios';



const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log("IP",HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const VerificationAPI = {
    // 1. Get All Verification Tasks
    getAllVerificationTasks: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/verification-task/`);
            console.log("VERIF",response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching all verification tasks:', error);
            throw error;
        }
    },

    getVerificationTasksToday: async (category) => {
  try {
    console.log("VERIF");
            const response = await axios.get(`${BASE_URL}/api/verification-task/now/today/${category}`);
            console.log("VERIF",response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching today verification tasks:', error);
            throw error;
        }
    },

    getVerificationTasksByDate: async (category,date) => {
        try {
             const response = await axios.get(`${BASE_URL}/api/verification-task/by-date/${encodeURIComponent(date)}/${category}`);
            console.log("VERIF",response.data);
            return response.data;
        } catch (error) {
             console.error('Error fetching all verification tasks:', error);
            throw error;
        }
    },
    // 2. Get Verification Task by Booking ID
    getVerificationTaskByNOP: async (NOP) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/verification-task/`,+ encodeURIComponent(NOP));
            return response.data;
        } catch (error) {
            console.error(`Error fetching verification task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 3. Create Verification Task
    createVerificationTask: async (taskData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/verification-task/`, taskData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating verification task:', error);
            throw error;
        }
    },

    // 4. Update Verification Task by Booking ID
    updateVerificationTask: async (NOP, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/verification-task/`,+ encodeURIComponent(NOP), updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating verification task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 5. Delete Verification Task by Booking ID
    deleteVerificationTask: async (NOP) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/verification-task/${encodeURIComponent(NOP)}`,);
            return response.data;
        } catch (error) {
            console.error(`Error deleting verification task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },
};

export default VerificationAPI;
