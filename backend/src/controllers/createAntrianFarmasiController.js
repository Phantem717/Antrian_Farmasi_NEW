const {createAntrianFarmasi} = require('../services/createFarmasiQueueService')

const createAntrian = async (req,res) =>{
try {
    const {medicine_type} = req.body

    if(!medicine_type){
        return res.status(400).json({ message: "medicine type not found" });

    }
    
    // const payload = {medicine_type};
    const data = await createAntrianFarmasi(medicine_type);
    res.status(200).json({ data });


} catch (error) {
    console.error('Error pada createAntrianController:', error.message);
        res.status(500).json({ message: 'Gagal createAntrian', error: error.message });
}
}

module.exports = {createAntrian};