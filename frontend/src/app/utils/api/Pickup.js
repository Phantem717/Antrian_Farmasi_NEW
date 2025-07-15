import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const PickupAPI = {
    // 1. Get All Pickup Tasks
    getAllPickupTasks: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pickup-task/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all pickup tasks:', error);
            throw error;
        }
    },

    // 2. Get Pickup Task by Booking ID
    getPickupTaskByNOP: async (NOP) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pickup-task/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching pickup task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 3. Create Pickup Task
    createPickupTask: async (taskData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/pickup-task/`, taskData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating pickup task:', error);
            throw error;
        }
    },

    // ✅ Update Pickup Task dengan format body yang benar
    updatePickupTask: async (NOP, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/pickup-task/${encodeURIComponent(NOP)}`, updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Error updating pickup task with Booking ID ${NOP}:`, error.response?.data || error.message);
            throw error;
        }
    },

    getPickupToday: async() => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pickup-task/today/now`);
            return response.data;        } catch (error) {
            console.error(`Error fetching pickup task with Booking ID ${NOP}:`, error);
            throw error;
        }
    }
,
 getPickupByDate: async(date) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pickup-task/by-date/${encodeURIComponent(date)}`);
            return response.data;        
        } catch (error) {
            console.error(`Error fetching pickup task with Booking ID ${NOP}:`, error);
            throw error;
        }
    }
,
    // 5. Delete Pickup Task by Booking ID
    deletePickupTask: async (NOP) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/pickup-task/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting pickup task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },
};

export default PickupAPI;
