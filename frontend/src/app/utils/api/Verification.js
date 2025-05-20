//src\app\utils\api\Verification.js
import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

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

    // 2. Get Verification Task by Booking ID
    getVerificationTaskByBookingId: async (bookingId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/verification-task/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching verification task with Booking ID ${bookingId}:`, error);
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
    updateVerificationTask: async (bookingId, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/verification-task/${bookingId}`, updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating verification task with Booking ID ${bookingId}:`, error);
            throw error;
        }
    },

    // 5. Delete Verification Task by Booking ID
    deleteVerificationTask: async (bookingId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/verification-task/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting verification task with Booking ID ${bookingId}:`, error);
            throw error;
        }
    },
};

export default VerificationAPI;
