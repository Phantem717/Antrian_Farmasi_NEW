import axios from 'axios';


const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const responsesAPI = {

    getAllResponses: async(location)=> {
        try {
             const response = await axios.get(`${BASE_URL}/api/responses/${location}`);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
;        }
    },

    getVerificationResponses: async(location)=>{
        try {
             const response = await axios.get(`${BASE_URL}/api/responses/verify/${location}`);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    },

    getPickupResponses:async(location)=>{
  try {
             const response = await axios.get(`${BASE_URL}/api/responses/pickup/${location}`);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    }
,
    getMedicineRespomses:async(location)=>{
try {
             const response = await axios.get(`${BASE_URL}/api/responses/medicine/${location}`);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    }
};

export default responsesAPI;