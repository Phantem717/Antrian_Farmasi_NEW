
const VerificationTask = require('../models/verificationTask');
const MedicineTask = require('../models/medicineTask');
const PickupTask = require('../models/pickupTask');
const loket = require('../models/loket');
const PharmacyTask = require('../models/pharmacyTask');
const getAllResponses = async (location) => {
  try {
    if (!location) {
      throw new Error("Location must have a value");
    }

    if(location.toLowerCase() == "bpjs"){location = "Lantai 1 BPJS"};
    if(location.toLowerCase() == "gmcb"){location = "Lantai 1 GMCB"};
    if(location.toLowerCase() == "lt3"){location = "Lantai 3 GMCB"};

    const [verificationResp, medicineResp, pickupResp, loketResp, pharmacyResp] = await Promise.all([
      VerificationTask.getToday(location),
      MedicineTask.getMedicineToday(location),
      PickupTask.getPickupDisplay(location),
      loket.getAll(),
    ]);

    return {
      verificationData: verificationResp.sort((a, b) =>
        a.queue_number.localeCompare(b.queue_number, undefined, { numeric: true })),
      medicineData: medicineResp,
      pickupData: pickupResp,
      loketData: loketResp,
    };
  } catch (error) {
    console.error("? Error fetching all responses:", error);
    throw error; 
  }
};

const getMedicineResponses = async (location) => {
  
    if(location.toLowerCase() == "bpjs"){location = "Lantai 1 BPJS"};
    if(location.toLowerCase() == "gmcb"){location = "Lantai 1 GMCB"};
    if(location.toLowerCase() == "lt3"){location = "Lantai 3 GMCB"};

  try {
    if (!location) {
      throw new Error("Location must have a value");
    }

    const [medicineResp] = await Promise.all([
      MedicineTask.getMedicineToday(location),
    
    ]);

    return {
      medicineData: medicineResp.sort((a, b) =>
        a.queue_number.localeCompare(b.queue_number, undefined, { numeric: true })),
   
    };
  } catch (error) {
    console.error("? Error fetching all responses:", error);
    throw error;
  }
};




const getVerificationResponses = async (location) => {
  

  try {
    if (!location) {
      throw new Error("Location must have a value");
    }
    if(location.toLowerCase() == "bpjs"){location = "Lantai 1 BPJS"};
    if(location.toLowerCase() == "gmcb"){location = "Lantai 1 GMCB"};
    if(location.toLowerCase() == "lt3"){location = "Lantai 3 GMCB"};

    const [verificationResp] = await Promise.all([
      VerificationTask.getToday(location),
    
    ]);

    return {
      verificationData: verificationResp.sort((a, b) =>
        a.queue_number.localeCompare(b.queue_number, undefined, { numeric: true })),
   
    };
  } catch (error) {
    console.error("? Error fetching all responses:", error);
    throw error;
  }
};

const getPickupResponses = async (location) => {

  try {
    if (!location) {
      throw new Error("Location must have a value");
    }
    if(location.toLowerCase() == "bpjs"){location = "Lantai 1 BPJS"};
    if(location.toLowerCase() == "gmcb"){location = "Lantai 1 GMCB"};
    if(location.toLowerCase() == "lt3"){location = "Lantai 3 GMCB"};

    const [pickupResp] = await Promise.all([
     
      PickupTask.getPickupToday(location),
     
    ]);

    return {
    
      pickupData: pickupResp,
   
    };
  } catch (error) {
    console.error("? Error fetching all responses:", error);
    throw error;
  }
};


module.exports = {
  getAllResponses,
  getVerificationResponses,
  getMedicineResponses,
  getPickupResponses

};