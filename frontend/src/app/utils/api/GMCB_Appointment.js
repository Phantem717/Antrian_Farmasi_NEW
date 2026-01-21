import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const GMCBAppointmentAPI = {
    // 1. Get All Appointments
    getAllAppointments: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/GMCB-appointment`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }
    },

    getAppointmentByLocation: async(location)=> {
 try {
            const response = await axios.get(`${BASE_URL}/api/GMCB-appointment/${encodeURIComponent(location)}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching all appointments:', error);
            throw error;
        }
    },
    // 2. Get Single Appointment by Booking ID
    getAppointmentByNOP: async (NOP) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/GMCB-appointment/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching appointment with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    getLatestAntrian: async ()=>{
        try {
            const response = await axios.get(`${BASE_URL}/api/GMCB-appointment/antrian`);
            return response.data;

        } catch (error) {
            console.error(`Error fetching appointment with Booking ID ${NOP}:`, error);
            throw error;
        }
    },

    // 3. Create New Appointment
    createAppointment: async (appointmentData) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/GMCB-appointment`, appointmentData);
            return response.data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // 4. Update Appointment
    // updateAppointment: async (NOP, updatedData) => {
    //     try {
    //         const response = await axios.put(`${BASE_URL}/api/doctor-appointments/`,+ encodeURIComponent(NOP), updatedData);
    //         return response.data;
    //     } catch (error) {
    //         console.error(`Error updating appointment with Booking ID ${NOP}:`, error);
    //         throw error;
    //     }
    // },

    // 5. Delete Appointment
    deleteAppointment: async (NOP) => {
        try {
            const response = await axios.delete(`${BASE_URL}/api/GMCB-appointment/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting appointment with Booking ID ${NOP}:`, error);
            throw error;
        }
        
    },
     updateStatusMedicine : async (NOP, status_medicine) => {
        try {
          const response = await axios.patch(
            `${BASE_URL}/api/GMCB-appointment/${encodeURIComponent(NOP)}/status_medicine`,
            { status_medicine }  // The status should be sent as a body parameter
          );
          return response.data;
        } catch (error) {
          console.error(`Error updating status medicine for appointment with Booking ID ${NOP}:`, error);
          throw error;
        }
      },
    
      updateMedicineType : async(NOP,status_medicine,farmasi_queue_number) => {
        try {
            const response = await axios.put(
                `${BASE_URL}/api/GMCB-appointment/type/${encodeURIComponent(NOP)}`,
                { status_medicine,farmasi_queue_number }  // The status should be sent as a body parameter
              );
              return response.data;
        } catch (error) {
            console.error(`Error updating MedicinetType for appointment with Booking ID ${NOP}:`, error);
            throw error;
        }
       
      },
      updatePhoneNumber: async(NOP,phone_number) => {
          try {
            const response = await axios.put(
                `${BASE_URL}/api/GMCB-appointment/${encodeURIComponent(NOP)}/phone_number`,
                { phone_number }  // The status should be sent as a body parameter
              );
              return response.data;
        } catch (error) {
            console.error(`Error updating MedicinetType for appointment with Booking ID ${NOP}:`, error);
            throw error;
        }
       
      },

      getUpdateTotalMedicine: async (requestBody) => {
        try {
            console.log("requestBody",requestBody);
            const response = await axios.patch(
                `${BASE_URL}/api/GMCB-appointment/total_medicine`, // Your endpoint URL
                requestBody,                       // The request body
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching status:', error);
            throw error;
        }
    },

getTotalMedicineByDate: async (category,date) => {
        try {
             const response = await axios.get(`${BASE_URL}/api/GMCB-appointment/by-date/${date}/${category}`);
            console.log("VERIF",response.data);
            return response.data;
        } catch (error) {
             console.error('Error fetching all verification tasks:', error);
            throw error;
        }
    },
    updatePaymentStatus: async (NOP) => {
        try {
            const response = await axios.patch(`${BASE_URL}/api/GMCB-appointment/update_status/${encodeURIComponent(NOP)}`);
            return response.data;
        } catch (error) {
            console.error(`Error updating payment status for appointment with Booking ID ${NOP}:`, error);
            throw error;
        }
    }

};

export default GMCBAppointmentAPI;
