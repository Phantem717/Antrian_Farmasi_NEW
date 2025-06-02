// const {login} = require('../services/loginService');
const jwt = require('jsonwebtoken'); // CommonJS

const refreshController = async  (req,res) => {
    try {
        const {refresh_token} = req.body;

        if(!refresh_token){
            return res.status(400).json({message: "Refresh Token Not Found"});
        }
    
        // const data = await login(username,password);
        const decoded = jwt.verify(refresh_token);
    
        return res.status(200).json(data);
    } catch (error) {
        console.error("Login Failed: ",error);
        throw error;
    }
 
}

module.exports = {checkLoginController};