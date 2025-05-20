import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

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
    getPickupTaskByBookingId: async (bookingId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/pickup-task/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching pickup task with Booking ID ${bookingId}:`, error);
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
    updatePickupTask: async (bookingId, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/pickup-task/${bookingId}`, updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Error updating pickup task with Booking ID ${bookingId}:`, error.response?.data || error.message);
            throw error;
        }
    },

    // 5. Delete Pickup Task by Booking ID
    deletePickupTask: async (bookingId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/pickup-task/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting pickup task with Booking ID ${bookingId}:`, error);
            throw error;
        }
    },
};

export default PickupAPI;
