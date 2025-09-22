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


module.exports = {
    getStatus
}