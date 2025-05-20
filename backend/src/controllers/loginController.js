const {login} = require('../services/loginService');
const checkLoginController = async  (req,res) => {
    try {
        const {username,password} = req.body;

        if(!username || !password){
            return res.status(400).json({message: "Username dan Password Tidak Ditemukan"});
        }
    
        const data = await login(username,password);
    
        return res.status(200).json(data);
    } catch (error) {
        console.error("Login Failed: ",error);
        throw error;
    }
 
}

module.exports = {checkLoginController};