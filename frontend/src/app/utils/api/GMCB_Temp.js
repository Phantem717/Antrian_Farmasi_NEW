import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const GMCBTempAPI = {
    // 1. Get All Appointments
    verifyTemp: async (tempId,verificationData)=>{
        try {
            const response = await axios.post(`${BASE_URL}/api/GMCB-temp/verify`,{tempId,verificationData});
            console.log("VERIF TEMP",response.data);
            return response.data;
        } catch (error) {
             console.error('Error Verifying Antrian:', error);
            throw error;
        }

    },
    
};

export default GMCBTempAPI;
