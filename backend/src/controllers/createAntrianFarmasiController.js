const {createAntrianFarmasi} = require('../services/createFarmasiQueueService')

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

module.exports = {createAntrian};