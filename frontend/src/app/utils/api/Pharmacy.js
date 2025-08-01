import axios from 'axios';



const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const PharmacyAPI = {
    // 1. Get All Pharmacy Tasks
    getAllPharmacyTasks: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pharmacy-tasks/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all pharmacy tasks:', error);
            throw error;
        }
    },

     getAllPharmacyTasksByStatus: async (category,status) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pharmacy-tasks/status/${status}/${category}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all pharmacy tasks:', error);
            throw error;
        }
    },

    // 2. Get Pharmacy Task by Booking ID
    getPharmacyTaskByNOP: async (NOP) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pharmacy-tasks/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching pharmacy task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 3. Create Pharmacy Task
    createPharmacyTask: async (taskData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/pharmacy-tasks/`, taskData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating pharmacy task:', error);
            throw error;
        }
    },

    // 4. Update Pharmacy Task by Booking ID
    updatePharmacyTask: async (NOP, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/pharmacy-tasks/`+  encodeURIComponent(NOP), updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating pharmacy task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 5. Delete Pharmacy Task by Booking ID
    deletePharmacyTask: async (NOP) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/pharmacy-tasks/${encodeURIComponent(NOP)}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting pharmacy task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },
};

export default PharmacyAPI;
