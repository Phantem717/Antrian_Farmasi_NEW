import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const DoctorAppointmentAPI = {
    // 1. Get All Appointments
    getAllAppointments: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/doctor-appointments`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }
    },

    // 2. Get Single Appointment by Booking ID
    getAppointmentByBookingId: async (bookingId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/doctor-appointments/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment with Booking ID ${bookingId}:`, error);
            throw error;
        }
    },

    getLatestAntrian: async ()=>{
        try {
            const response = await axios.get(`${BASE_URL}/api/doctor-appointments/antrian`);
            return response.data;

        } catch (error) {
            console.error(`Error fetching appointment with Booking ID ${bookingId}:`, error);
            throw error;
        }
    },

    // 3. Create New Appointment
    createAppointment: async (appointmentData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/doctor-appointments`, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // 4. Update Appointment
    updateAppointment: async (bookingId, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/api/doctor-appointments/${bookingId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating appointment with Booking ID ${bookingId}:`, error);
            throw error;
        }
    },

    // 5. Delete Appointment
    deleteAppointment: async (bookingId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/doctor-appointments/${bookingId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting appointment with Booking ID ${bookingId}:`, error);
            throw error;
        }
        
    },
     updateStatusMedicine : async (bookingId, status_medicine) => {
        try {
          const response = await axios.patch(
            `${BASE_URL}/api/doctor-appointments/${bookingId}/status_medicine`,
            { status_medicine }  // The status should be sent as a body parameter
          );
          return response.data;
        } catch (error) {
          console.error(`Error updating status medicine for appointment with Booking ID ${bookingId}:`, error);
          throw error;
        }
      },
      
};

export default DoctorAppointmentAPI;
