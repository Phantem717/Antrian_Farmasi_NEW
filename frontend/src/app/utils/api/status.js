import axios from 'axios';

const HOST = process.env.NEXT_PUBLIC_API_HOST;
const PORT = process.env.NEXT_PUBLIC_API_PORT;
console.log("IP", HOST, PORT);
const BASE_URL = `http://${HOST}:${PORT}`;

const StatusAPI = {
    getStatus: async (requestBody) => {
        try {
            const response = await axios.post(
                `${BASE_URL}/api/pharmacy-status`, // Your endpoint URL
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
    }
}

export default StatusAPI;