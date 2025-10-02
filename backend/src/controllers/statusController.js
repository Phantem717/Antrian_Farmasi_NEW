const statusTask = require('../models/status');

const getStatus = async (req, res) => {
    try {
        const { phone_number, full_name, nik, location, date_of_birth } = req.body;

        if (!date_of_birth || !location) {
            return res.status(400).json({ message: "Date of Birth and Location are required" });
        }

        // Define search priorities
        console.log("VARCONT", phone_number, full_name, nik, location, date_of_birth);
        const searchOrder = [
            { value: phone_number, fn: statusTask.getPharmacyStatusByNoTelpon },
            { value: nik, fn: statusTask.getPharmacyStatusByNIK },
            { value: full_name, fn: statusTask.getPharmacyStatusByName }
        ];

        for (const search of searchOrder) {
            if (search.value && search.value !== "-") {
                const status = await search.fn(search.value, date_of_birth, location);
                console.log("STATUS", status);
                if (status && status.length > 0) {
                    return res.status(200).json({
                        message: "Data Sent Successfully",
                        data: status
                    });
                }
            }
        }

        // If no results found after all checks
        return res.status(404).json({
            message: "No status found for the provided parameters"
        });

    } catch (error) {
        console.error("Error fetching STATUS:", error);
        return res.status(500).json({
            message: "Failed to fetch STATUS",
            error: error.message
        });
    }

   
};

const getTimestamp= async (req, res) => {
    try {
          const { phone_number, full_name, nik, location, date_of_birth } = req.body;

        if (!date_of_birth || !location) {
            return res.status(400).json({ message: "Date of Birth and Location are required" });
        }

        // Define search priorities
        console.log("VARCONT", phone_number, full_name, nik, location, date_of_birth);
        const searchOrder = [
            { value: phone_number, fn: statusTask.getPharmacyTimestampByNoTelpon },
            { value: nik, fn: statusTask.getPharmacyTimestampByNIK },
            { value: full_name, fn: statusTask.getPharmacyTimestampByName }
        ];

        for (const search of searchOrder) {
            if (search.value && search.value !== "-") {
                const status = await search.fn(search.value, date_of_birth, location);
                console.log("STATUS", status);
                if (status && status.length > 0) {
                    return res.status(200).json({
                        message: "Data Sent Successfully",
                        data: status
                    });
                }
            }
        }

        // If no results found after all checks
        return res.status(404).json({
            message: "No status found for the provided parameters"
        });
    } catch (error) {
         console.error("Error fetching STATUS:", error);
        return res.status(500).json({
            message: "Failed to fetch STATUS",
            error: error.message
        });
    }
};

 const getPharmacyNOP = async (req,res) => {
     try {
        const { NOP,location } = req.body;

        if (!NOP) {
            return res.status(400).json({ message: "NOP REQUIRED" });
        }
        console.log("VARCONT", NOP, location);
        // Define search priorities
        // console.log("VARCONT", phone_number, full_name, nik, location, date_of_birth);
    
        const response = await statusTask.getPharmacyByNOP(NOP, location);
        console.log("STATUS", response);
        if (response && response.length > 0) {
            return res.status(200).json({
                message: "Data Sent Successfully",
                data: response
            });
        }

        // If no results found after all checks
        return res.status(404).json({
            message: "No status found for the provided parameters"
        });

    } catch (error) {
        console.error("Error fetching STATUS:", error);
        return res.status(500).json({
            message: "Failed to fetch STATUS",
            error: error.message
        });
    }        
}

module.exports = {
    getStatus,
    getPharmacyNOP,
    getTimestamp
};