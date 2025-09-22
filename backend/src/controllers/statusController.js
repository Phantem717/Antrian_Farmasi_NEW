const statusTask = require('../models/status');

const getStatus = async (req, res) => {
    try {
        const { phone_number, full_name, nik, location, date_of_birth } = req.body;
        
        // Validate required fields
        if (!date_of_birth || !location) {
            return res.status(400).json({ message: "Date of Birth and Location are required" });
        }

        let status;

        // Check in priority order
        if (phone_number && phone_number !== "-") {
            status = await statusTask.getPharmacyStatusByNoTelpon(phone_number, date_of_birth, location);
        } 
        else if (nik && nik !== "-") {
            status = await statusTask.getPharmacyStatusByNIK(nik, date_of_birth, location);
        }
        else if (full_name && full_name !== "-") {
            status = await statusTask.getPharmacyStatusByName(full_name, date_of_birth, location);
        }
        else {
            return res.status(400).json({ 
                message: "At least one search parameter is required: phone_number, nik, or full_name" 
            });
        }

        // Check if status was found
        if (!status) {
            return res.status(404).json({ 
                message: "No status found for the provided parameters" 
            });
        }

        res.status(200).json({ 
            message: "Data Sent Successfully", 
            data: status 
        });

    } catch (error) {
        console.error("Error fetching STATUS:", error);
        res.status(500).json({ 
            message: "Failed to fetch STATUS", 
            error: error.message 
        });
    }
}

module.exports = {
    getStatus
}