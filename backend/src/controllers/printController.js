const {printAntrianFarmasi} = require('../services/printAntrianService')

const printFarmasiController = async (req,res) =>{
try {
    let data = req.body
    console.log("PRINT DATA",data);
    let dataPrint;
    if(data.queue_number.startsWith("RC") || data.queue_number.startsWith("NR")){
 if(!data.phone_number|| !data.barcode || !data.patient_name  || !data.medicine_type || !data.queue_number || !data.lokasi){
        return res.status(400).json({ message: "Payload incomplete. Required: phone_number, booking_id, queue_number, patient_name." });

    }
    if (data.lokasi == "bpjs"){
        data.lokasi = "Lantai 1 BPJS"
    }
    else if(data.lokasi == "gmcb"){
        data.lokasi = "Lantai 1 GMCB"
    }
    else if(data.lokasi == "lt3"){
        data.lokasi = "Lantai 3 GMCB"
    }
    dataPrint = await printAntrianFarmasi(data);
    }
    else{
        if (data.lokasi == "bpjs"){
            data.lokasi = "Lantai 1 BPJS"
        }
        else if(data.lokasi == "gmcb"){
            data.lokasi = "Lantai 1 GMCB"
        }
        else if(data.lokasi == "lt3"){
            data.lokasi = "Lantai 3 GMCB"
        }
        dataPrint = await printAntrianFarmasi(data);
    }
   
    res.status(200).json({ dataPrint });


} catch (error) {
    console.error('Error pada SendPrintController:', error.message);
        res.status(500).json({ message: 'Gagal Print', error: error.message });
}
}

module.exports = {printFarmasiController};