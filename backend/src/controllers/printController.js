const {printAntrianFarmasi} = require('../services/printAntrianService')

const printFarmasiController = async (req,res) =>{
try {
    const data = req.body
    console.log("PRINT DATA",data);

    if(!data.phone_number|| !data.barcode || !data.patient_name  || !data.medicine_type || !data.SEP || !data.tanggal_lahir || !data.queue_number){
        return res.status(400).json({ message: "Payload incomplete. Required: phone_number, booking_id, queue_number, patient_name." });

    }
    const dataPrint = await printAntrianFarmasi(data);
    res.status(200).json({ dataPrint });


} catch (error) {
    console.error('Error pada SendPrintController:', error.message);
        res.status(500).json({ message: 'Gagal Print', error: error.message });
}
}

module.exports = {printFarmasiController};