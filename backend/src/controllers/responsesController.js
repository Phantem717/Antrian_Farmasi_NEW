
const VerificationTask = require('../models/verificationTask');
const MedicineTask = require('../models/medicineTask');
const PickupTask = require('../models/pickupTask');
const loket = require('../models/loket');
const PharmacyTask = require('../models/pharmacyTask');

const getAllResponses = async (req, res) => {
  try {
    const { location } = req.params;

    if (!location) {
      return res.status(400).json({ message: 'location must have a value' });
    }

    // Await all model fetches in parallel for performance
    const [
      verificationResp,
      medicineResp,
      pickupResp,
      loketResp,
      pharmacyResp
    ] = await Promise.all([
      VerificationTask.getAll(),
      MedicineTask.getAll(),
      PickupTask.getAll(),
      loket.getAll(),
      PharmacyTask.getAll()
    ]);

    const data = {
      verificationData: verificationResp.filter(item => item.lokasi == location),
      medicineData : medicineResp.filter(item => item.lokasi == location),
      pickupData: pickupResp.filter(item => item.lokasi == location),
      loketData: loketResp,
      pharmacyData: pharmacyResp.filter(item => item.lokasi == location)
    };
    const io = req.app.get('socketio');

    io.emit('get_responses',{
      message: 'Responses Got',
      data: data
    });
    if(location == "Lantai 1 GMCB"){
      io.emit('get_responses_gmcb',{
        message: 'Responses Got',
        data: data
      });
    }
    if(location == "Lantai 3 GMCB"){
      io.emit('get_responses_lt3',{
        message: 'Responses Got',
        data: data
      });
    }
    if(location == "Lantai 1 BPJS"){
      io.emit('get_responses_bpjs',{
        message: 'Responses Got',
        data: data
      });
    }
    
    // console.log("RESPONSE DATA: ",data);
    return res.status(200).json({ data, message: "Responses successfully sent" });

  } catch (error) {
    console.error("? Error fetching all responses:", error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
    getAllResponses,
  };
  