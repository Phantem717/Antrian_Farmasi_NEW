const {sendWAVerif,sendWAAntrian,sendWAProses,sendWAPickup,sendWACustom} = require('../services/sendWAService2')

const sendWAVerifController  = async (req,res) => {
    try {
        let { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,prev_queue_number, switch_WA, location } = req.body;
      console.log("PHONE BODY",req.body);
        // Check if required fields exist
        if(location == "bpjs"){
          location = "Lantai 1 BPJS"
        }
        else if(location == "gmcb"){
          location = "Lantai 1 GMCB"
        }
        else if(location == "lt3"){
          location = "Lantai 3 GMCB"
        }
        if (!phone_number || !NOP || !queue_number|| !patient_name || !docter || !medicine_type || !location) {
          return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name, location." });
        }
        
            if (phone_number.startsWith("0")) {
      phone_number = "62" + phone_number.slice(1);
    }
        const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,prev_queue_number, switch_WA, location  };
        const data = await sendWAVerif(payload);
    
        res.status(200).json({ data });
      } catch (error) {
        console.error('Error pada SendWAProsesController:', error.message);
        res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
      }
}

const sendWAAntrianController  = async (req,res) => {
    try {
        let { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,switch_WA, location } = req.body;
        console.log("CHECK ANTRIAN PAYLOAD",phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type );
        // Check if required fields exist
        if (!phone_number || !NOP || !queue_number|| !patient_name || !docter|| !location ) {
            return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
          }
       if(location == "bpjs"){
          location = "Lantai 1 BPJS"
        }
        else if(location == "gmcb"){
          location = "Lantai 1 GMCB"
        }
        else if(location == "lt3"){
          location = "Lantai 3 GMCB"
        }
                    if (phone_number.startsWith("0")) {
      phone_number = "62" + phone_number.slice(1);
    }
          const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type ,switch_WA,location };
        const data = await sendWAAntrian(payload);
    
        res.status(200).json({ data });
      } catch (error) {
        console.error('Error pada SendWAProsesController:', error.message);
        res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
      }
    }

    const sendWAPickupController  = async (req,res) => {
        try {
            let { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,switch_WA,loket,location } = req.body;
    
            // Check if required fields exist
            if (!phone_number || !NOP || !queue_number|| !patient_name || !docter ||!medicine_type || !location) {
                return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
              }
           if(location == "bpjs"){
          location = "Lantai 1 BPJS"
        }
        else if(location == "gmcb"){
          location = "Lantai 1 GMCB"
        }
        else if(location == "lt3"){
          location = "Lantai 3 GMCB"
        }
                    if (phone_number.startsWith("0")) {
      phone_number = "62" + phone_number.slice(1);
    }
              const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,switch_WA,loket,location  };
            const data = await sendWAPickup(payload);
        
            res.status(200).json({ data });
          } catch (error) {
            console.error('Error pada SendWAProsesController:', error.message);
            res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
          }
        }
        const sendWAProsesController = async (req, res) => {
            try {
                let { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,switch_WA,location } = req.body;
          console.log("PHONE BODY",req.body);
            if (phone_number.startsWith("0")) {
      phone_number = "62" + phone_number.slice(1);
    }
                // Check if required fields exist
                if (!phone_number || !NOP || !queue_number|| !patient_name || !docter || !medicine_type || !location) {
                    return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
                  }
               if(location == "bpjs"){
          location = "Lantai 1 BPJS"
        }
        else if(location == "gmcb"){
          location = "Lantai 1 GMCB"
        }
        else if(location == "lt3"){
          location = "Lantai 3 GMCB"
        }
              const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type,switch_WA,location  };
              const data = await sendWAProses(payload);
          
              res.status(200).json({ data });
            } catch (error) {
              console.error('Error pada SendWAProsesController:', error.message);
              res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
            }
          };
          
          const sendWACustomController = async (req, res) => {
            try {
                const { phone_number,patient_name,message } = req.body;
          console.log("PHONE BODY",req.body);

                // Check if required fields exist
                if (!phone_number || !patient_name || !message) {
                    return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
                  }
                  const payload = { phone_number,  patient_name, message};
              const data = await sendWACustom(payload);
          
              res.status(200).json({ data });
            } catch (error) {
              console.error('Error pada SendWAProsesController:', error.message);
              res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
            }
          };

module.exports = {sendWAVerifController,sendWAAntrianController,sendWAPickupController,sendWAProsesController,sendWACustomController}