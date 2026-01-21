
const getStatusTask = require('../models/getPharmacyStatusTask');


const getStatus = async (req,res) => {
    try {
           const inputBody = req.body
           const input = inputBody.input;
 console.log("INPUT",input);
   if (!input.startsWith("NOP") && input.length != 19) {
  return res.status(400).json({ message: "INVALID INPUT USE NOP/BOOKING_ID/SEP" });
}
    
    let pharmacyStatusArray = input.startsWith("NOP") ? await getStatusTask.getByNOP(input) : await getStatusTask.getBySEP(input);

    if(!pharmacyStatusArray){
        return res.status(400).json({ message: "Data Not Found" });
    }

    console.log(pharmacyStatusArray);
    let status = "";
    if(pharmacyStatusArray .status == "waiting_verification"){
        status = "Obat Sedang Verifikasi"
    }
    if(pharmacyStatusArray .status == "waiting_medicine"){
        status = "Resep Mulai Dikerjakan"

    }
      if(pharmacyStatusArray .status == "waiting_pickup_medicine"){
        status = "Obat Selesai Dikemas"

    }
    if(pharmacyStatusArray .status == "called_pickup_medicine"){
        status = "Obat Seiap Diserahkan"

    }


    
    return res.status(201).json({
      message: "Data berhasil Diambil",
      data: pharmacyStatusArray,
      status: status
    });



    } catch (error) {
         console.error('Error Getting Pharmacy Task', error);
    res.status(500).json({ 
      message: 'Failed to Get Pharmacy Task', 
      error: error.message 
    });
    }
 








}

module.exports = {getStatus}