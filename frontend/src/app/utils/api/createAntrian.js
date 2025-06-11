import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const CreateAntrian = {
    createAntrian: async(medicineType) => {
        try {

            const response = await axios.post(`${BASE_URL}/api/create-farmasi/${medicineType}` );
            return response.data;

            
        } catch (error) {
            console.error(`❌ Error Making Antrian Farmasi:`, error.response?.data || error.message);
            throw error; 
        }
    },
    // 1. Check Queue by Booking ID
    
    
};

export default CreateAntrian;
