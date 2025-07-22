import { useInternalMessage } from "antd/es/message/useMessage";
import axios from "axios";

const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log("LOGIN",HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const loginAPI = {
    checkLogin: async (username,password) => {
        try {
            if(!username || !password){
                throw new Error("Username and password are required.");

            }
            const response = await axios.post(`${BASE_URL}/api/login`,{
                
                    username,password
                
            });

            console.log("LOGIN STATUS",response.status);
            // const text = response.text();
            // console.log("📡 Response dari Backend:", text);
            
            return response.data; // Pastikan respons dikonversi ke JSON
        } catch (error) {
            console.error("Error When Attempting To Login: ",error);
            throw error;
        }
    }
};

export default loginAPI;