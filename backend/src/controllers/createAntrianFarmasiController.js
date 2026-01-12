const {createAntrianFarmasi, createAntrianFarmasiGMCB} = require('../services/createFarmasiQueueService')

const createAntrian = async (req,res) =>{
try {
    let {medicineType,lokasi} = req.params;
    console.log("PARAMS",medicineType,lokasi);
    if(!medicineType || !lokasi){
        return res.status(400).json({ message: "medicine type + location not found" });

    }
    console.log("MEDICINE TP+YPE PREV:",medicineType, lokasi);

    let newMedicineType= "";
    if(medicineType == 'Non - Racikan'){
        newMedicineType = "nonracikan";
    }
    if(medicineType=='Racikan'){
        newMedicineType = "racikan";
    }
    console.log("MED TYPE CONTROLLER",newMedicineType);

    // const payload = {medicine_type};
    const data = await createAntrianFarmasi(newMedicineType,lokasi);
    res.status(200).json({ data });


} catch (error) {
    console.error('Error pada createAntrianController:', error.message);
        res.status(500).json({ message: 'Gagal createAntrian', error: error.message });
}
}
const createAntrianGMCB = async (req,res) =>{
try {
    let body = req.body;
    console.log("PARAMS",body.medicineType,body.lokasi,body.origin);
    if(!body.medicineType || !body.lokasi || !body.origin){
        return res.status(400).json({ message: "medicine type + location not found" });
    }

    console.log("MEDICINE TP+YPE PREV:",body.medicineType, body.lokasi);

    let newMedicineType= "";
    if(body.medicineType == 'Non - Racikan'){
        newMedicineType = "nonracikan";
    }
    if(body.medicineType=='Racikan'){
        newMedicineType = "racikan";
    }
    console.log("MED TYPE CONTROLLER",newMedicineType);

    let new_origin = "";
    if(body.origin.includes("Gawat")){
        new_origin = "IGD";
    }
    else if(body.origin.includes("Rehab") ||body.origin.includes("Endoskopi")){
        new_origin = "RE";
    }

    else if(body.origin.includes("Eksekutif")){
        new_origin = "EKS";
    }
    else if(body.origin.includes("Anak") || body.origin.includes("Baby") || body.origin.includes("laktasi") || body.origin.includes("Kebidanan" || body.origin.includes("Hamil"))){
        new_origin = "G3"
    }
    else{
        new_origin = "G1";
    }


    // const payload = {medicine_type};
    const data = await createAntrianFarmasiGMCB(newMedicineType,body.lokasi,new_origin);
    res.status(200).json({ data });


} catch (error) {
    console.error('Error pada createAntrianController:', error.message);
        res.status(500).json({ message: 'Gagal createAntrian', error: error.message });
}
}

module.exports = {createAntrian,createAntrianGMCB};