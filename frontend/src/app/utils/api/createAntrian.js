import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const CreateAntrian = {
    createAntrian: async(medicineType,lokasi) => {
        try {

            const response = await axios.post(`${BASE_URL}/api/create-farmasi/${medicineType}/${lokasi}` );
            return response.data;

            
        } catch (error) {
            console.error(`❌ Error Making Antrian Farmasi:`, error.response?.data || error.message);
            throw error; 
        }
    },
    // 1. Check Queue by Booking ID
    
    
};

export default CreateAntrian;
