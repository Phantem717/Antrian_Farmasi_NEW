const {createAntrianFarmasi} = require('../services/createFarmasiQueueService')

const createAntrian = async (req,res) =>{
try {
    let medicine_type = req.params.medicineType;
    if(!medicine_type){
        return res.status(400).json({ message: "medicine type not found" });

    }
    console.log("MEDICINE TP+YPE PREV:",medicine_type);

    let newMedicineType= "";
    if(medicine_type == 'Non - Racikan'){
        newMedicineType = "nonracikan";
    }
    if(medicine_type=='Racikan'){
        newMedicineType = "racikan";
    }
    console.log("MED TYPE CONTROLLER",newMedicineType);

    // const payload = {medicine_type};
    const data = await createAntrianFarmasi(newMedicineType);
    res.status(200).json({ data });


} catch (error) {
    console.error('Error pada createAntrianController:', error.message);
        res.status(500).json({ message: 'Gagal createAntrian', error: error.message });
}
}

module.exports = {createAntrian};