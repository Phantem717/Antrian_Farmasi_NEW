import axios from 'axios';

const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

const responsesAPI = {

    getAllResponses: async(location)=> {
        try {
             const response = await axios.get(`${BASE_URL}/api/responses/${location}`);
                        return response.data;
        } catch (error) {
            console.error("Error In Fetching Responses: ",error);
            throw error;
;        }
    }

};

export default responsesAPI;