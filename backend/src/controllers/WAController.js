const {sendWAVerif,sendWAAntrian,sendWAProses,sendWAPickup} = require('../services/sendWAService')

const sendWAVerifController  = async (req,res) => {
    try {
        const { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type } = req.body;
    
        // Check if required fields exist
        if (!phone_number || !NOP || !queue_number|| !patient_name || !docter || !nik || !rm || !sep || !medicine_type) {
          return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
        }
  
        const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type  };
        const data = await sendWAVerif(payload);
    
        res.status(200).json({ data });
      } catch (error) {
        console.error('Error pada SendWAProsesController:', error.message);
        res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
      }
}

const sendWAAntrianController  = async (req,res) => {
    try {
        const { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type } = req.body;
        console.log("CHECK ANTRIAN PAYLOAD",phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type );
        // Check if required fields exist
        if (!phone_number || !NOP || !queue_number|| !patient_name || !docter || !nik || !rm || !sep || !medicine_type) {
            return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
          }
      
          const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type  };
        const data = await sendWAAntrian(payload);
    
        res.status(200).json({ data });
      } catch (error) {
        console.error('Error pada SendWAProsesController:', error.message);
        res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
      }
    }

    const sendWAPickupController  = async (req,res) => {
        try {
            const { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type } = req.body;
    
            // Check if required fields exist
            if (!phone_number || !NOP || !queue_number|| !patient_name || !docter || !nik || !rm || !sep || !medicine_type) {
                return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
              }
          
              const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type  };
            const data = await sendWAPickup(payload);
        
            res.status(200).json({ data });
          } catch (error) {
            console.error('Error pada SendWAProsesController:', error.message);
            res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
          }
        }
        const sendWAProsesController = async (req, res) => {
            try {
                const { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type } = req.body;
    
                // Check if required fields exist
                if (!phone_number || !NOP || !queue_number|| !patient_name || !docter || !nik || !rm || !sep || !medicine_type) {
                    return res.status(400).json({ message: "Payload incomplete. Required: phone_number, NOP, queue_number, patient_name." });
                  }
              
                  const payload = { phone_number, NOP, queue_number, patient_name,docter,nik,rm,sep,medicine_type  };
              const data = await sendWAProses(payload);
          
              res.status(200).json({ data });
            } catch (error) {
              console.error('Error pada SendWAProsesController:', error.message);
              res.status(500).json({ message: 'Gagal mengirim pesan', error: error.message });
            }
          };
          

module.exports = {sendWAVerifController,sendWAAntrianController,sendWAPickupController,sendWAProsesController}