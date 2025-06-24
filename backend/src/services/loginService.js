const axios = require('axios');
require('dotenv').config();
const generateSignature = require('../utils/signature');

const consID = process.env.CONS_ID_FARMASI;
const PASSWORD = process.env.PASSWORD;

async function login(username, password) {
    try {
        const { timestamp, signature } = generateSignature(consID, PASSWORD);
        
        console.log("Request Headers:", {
            'X-cons-id': consID,
            'X-Timestamp': timestamp,
            'X-Signature': signature
        });

        const response = await axios({
            method: 'post',
            url: 'https://rscarolus.com/api/v1/auth/login',
            data: { 
                username: username,
                password: password 
            },
            headers: {
                'X-cons-id': consID,
                'X-Timestamp': timestamp,
                'X-Signature': signature,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error("Login Error Details:", {
            status: error.response?.status,
            headersSent: error.config?.headers,
            serverResponse: error.response?.data,
            message: error.message
        });
        throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
}

module.exports = { login };