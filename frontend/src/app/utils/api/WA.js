import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const WA_API = {

    sendWAVerif: async(payload)=> {
        try {
             const response = await axios.post(`${BASE_URL}/api/send/WA/verif`, payload);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    },
    sendWAProses: async(payload)=> {
        try {
             const response = await axios.post(`${BASE_URL}/api/send/WA/proses`, payload);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    },
    sendWAPickup: async(payload) => {
        try {
             const response = await axios.post(`${BASE_URL}/api/send/WA/pickup`, payload);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    },
    sendWAAntrian: async(payload)=> {
        try {
             const response = await axios.post(`${BASE_URL}/api/send/WA/antrian`, payload);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
        }
    }

    

};

export default WA_API;