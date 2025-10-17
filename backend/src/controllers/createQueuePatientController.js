const Doctor_Appoinment = require('../models/doctorAppointments');

const createQueuePatient = async (req, res) => {
    const date = new Date();
    let type = req.params.type.toLowerCase();
    
    // --- Input Validation ---
    if(!type || (type !== "jaminan" && type !== "umum")){
        return res.status(400).json({ message: "Tipe Antrian TIdak Sesuai" });
    }
    console.log("TYPE",type);
    // Determine the unique queue symbol
    let queue_symbol = (type === "jaminan") ? "C" : "D";

    // --- 1. Get Today's Date String (YYYYMMDD) ---
    const formattedToday = date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');

    // --- 2. Fetch Latest Queue for the SPECIFIC TYPE ('C' or 'D') ---
    const latestQueueRecord = await Doctor_Appoinment.getLatestAntrianJaminan(queue_symbol);
    console.log("LATEST QUEUE RECORD", latestQueueRecord);
    let queue_number;
    let number;

    if (!latestQueueRecord || !latestQueueRecord.NOP || latestQueueRecord.queue_number === "-") {
        // CASE 1: First queue of the day/system.
        queue_number = `${queue_symbol}-001`;

    } else {
        // --- 3. Date Check and Increment ---
        const latestNOPParts = latestQueueRecord.NOP.split("/");
        // Assuming NOP format is [SYMBOL]/[YYYYMMDD]/[NUMBER]
        const nopDatePart = latestNOPParts.length > 1 ? latestNOPParts[1] : null; 
        
        if (nopDatePart === formattedToday) {
            // CASE 2: Same day. Increment the sequence number.
            
            // Extract number from the queue_number field (e.g., gets '005' from 'C-005')
            number = parseInt(latestQueueRecord.queue_number.split("-")[1], 10) + 1;
            
            queue_number = `${queue_symbol}-${String(number).padStart(3, '0')}`;
        } else {
            // CASE 3: New day. Reset the number.
            queue_number = `${queue_symbol}-001`;
        }
    }
    
    // --- 4. Calculate Final NOP ---
    // NOP is constructed as: SYMBOL/YYYYMMDD/NNN (e.g., C/20251016/001)
    const sequenceNumber = queue_number.split("-")[1];
    const NOP = `${queue_symbol}/${formattedToday}/${sequenceNumber}`;
    
    // Return the calculated values to the frontend for insertion
    return res.status(200).json({ message: "Success", queue_number: queue_number, NOP: NOP });
}

module.exports = {
    createQueuePatient
}
