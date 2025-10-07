const Doctor_Appoinment = require('../models/doctorAppointments');

const createQueuePatient = async (req, res) => {
const date = new Date();
let type = req.params.type.toLowerCase();
console.log("TYPEBE",type);

let number;
let queue_number;
let nop_date;
let queue_symbol;

if(!type){
    return res.status(400).json({ message: "type not found" });
}

if(type != "jaminan" && type != "umum"){
    return res.status(400).json({ message: "Tipe Antrian TIdak Sesuai" });
}

if(type == "jaminan"){
    queue_symbol = "C";
}
else if(type == "umum"){
    queue_symbol = "D";
}

const formatted = date.getFullYear().toString() +
  String(date.getMonth() + 1).padStart(2, '0') +
  String(date.getDate()).padStart(2, '0');

console.log("DATE", formatted); // e.g. 20251002
const NOPQueue = await Doctor_Appoinment.getLatestAntrian();
const latestQueue = await Doctor_Appoinment.getLatestAntrianJaminan(queue_symbol);
console.log("latestQueue", latestQueue);

if(!latestQueue || latestQueue.queue_number == "-"){
    queue_number = `${queue_symbol}-001`;

}
else{
nop_date = NOPQueue.NOP.split("/")[1];
console.log("NOP DATE",nop_date,formatted);
if (nop_date == formatted) {
number = parseInt(latestQueue.queue_number.split("-")[1],10)+ 1 ;
console.log("NUM",number);
queue_number = `${queue_symbol}-${String(number).padStart(3, '0')}`;
}
else{
        queue_number = `${queue_symbol}-001`;

}
}

return res.status(200).json({ message: "Success", queue_number: queue_number });



}

module.exports = {
    createQueuePatient
}