//src\app\utils\api\Medicine.js
import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const MedicineAPI = {
    // 1. Get All Medicine Tasks
    getAllMedicineTasks: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/medicine-task/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all medicine tasks:', error);
            throw error;
        }
    },

    // 2. Get Medicine Task by Booking ID
    getMedicineTaskByNOP: async (NOP) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/medicine-task/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching medicine task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 3. Create Medicine Task (Updated sesuai gambar)
    createMedicineTask: async (taskData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/medicine-task/`, taskData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating medicine task:', error);
            throw error;
        }
    },

    // 4. Update Medicine Task
    updateMedicineTask: async (NOP, updatedData) => {
        try {
            console.log("MEDICINEDATA",updatedData);
            const response = await axios.put(`${BASE_URL}/api/medicine-task/${encodeURIComponent(NOP)}`, updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating medicine task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 5. Delete Medicine Task
    deleteMedicineTask: async (NOP) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/medicine-task/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting medicine task with Booking ID ${NOP}:`, error);
            throw error;
        }
    },
};

export default MedicineAPI;
