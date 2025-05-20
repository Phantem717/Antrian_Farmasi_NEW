const {printAntrianFarmasi} = require('../services/printAntrianService')

const printFarmasiController = async (req,res) =>{
try {
    const {phone_number,barcode,patient_name,farmasi_queue_number,medicine_type, SEP, tanggal_lahir,queue_number} = req.body
   
    if(!phone_number|| !barcode || !patient_name || !farmasi_queue_number || !medicine_type || !SEP || !tanggal_lahir || !queue_number){
        return res.status(400).json({ message: "Payload incomplete. Required: phone_number, booking_id, queue_number, patient_name." });

    }
    
    const payload = {phone_number,barcode,patient_name,farmasi_queue_number,medicine_type, SEP, tanggal_lahir,queue_number};
    const data = await printAntrianFarmasi(payload);
    res.status(200).json({ data });


} catch (error) {
    console.error('Error pada SendPrintController:', error.message);
        res.status(500).json({ message: 'Gagal Print', error: error.message });
}
}

module.exports = {printFarmasiController};