
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

    const [verificationResp, medicineResp, pickupResp, loketResp, pharmacyResp] = await Promise.all([
      VerificationTask.getAll(),
      MedicineTask.getAll(),
      PickupTask.getAll(),
      loket.getAll(),
      PharmacyTask.getAll()
    ]);

    return {
      verificationData: verificationResp.filter(item => item.lokasi === location).sort((a, b) =>
        a.queue_number.localeCompare(b.queue_number, undefined, { numeric: true })),
      medicineData: medicineResp.filter(item => item.lokasi === location),
      pickupData: pickupResp.filter(item => item.lokasi === location),
      loketData: loketResp,
      pharmacyData: pharmacyResp.filter(item => item.lokasi === location)
    };
  } catch (error) {
    console.error("? Error fetching all responses:", error);
    throw error;
  }
};

const getMedicineResponses = async (location) => {
  try {
    if (!location) {
      throw new Error("Location must have a value");
    }

    const [medicineResp] = await Promise.all([
      MedicineTask.getAll(),
    
    ]);

    return {
      medicineData: medicineResp.filter(item => item.lokasi === location).sort((a, b) =>
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

    const [verificationResp] = await Promise.all([
      VerificationTask.getAll(),
    
    ]);

    return {
      verificationData: verificationResp.filter(item => item.lokasi === location).sort((a, b) =>
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

    const [pickupResp] = await Promise.all([
     
      PickupTask.getAll(),
     
    ]);

    return {
    
      pickupData: pickupResp.filter(item => item.lokasi === location),
   
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
