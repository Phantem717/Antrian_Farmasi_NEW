const axios = require('axios');
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();

const BASE_URL= process.env.API_URL
async function login(username,password){
    try {
    const url = `http://192.168.6.86/api/v1/auth/login`
    const response = await axios.post(url, {
        username,password
    });
    return response.data;
    } catch (error) {
        console.error("Login Error",error);
        throw error;
    }
    


}




module.exports = {login};