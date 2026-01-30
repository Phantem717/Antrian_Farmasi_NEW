const express = require("express");
const router = express.Router();
const {
  createPharmacyTask,
  getPharmacyTaskByNOP,
  getAllPharmacyTasks,
  updatePharmacyTask,
  deletePharmacyTask,
  getAllPharmacyTasksByStatus,
  getAllPharmacyTasksToday
} = require("../controllers/pharmacyTaskController");

// 🔹 Endpoint untuk membuat Pharmacy Task
router.post("/", (req,res) => {
  // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Create a new pharmacy task'
  // #swagger.description = 'Creates a new pharmacy task'
  createPharmacyTask(req, res);});

// 🔹 Endpoint untuk mengambil semua Pharmacy Task
router.get("/", (req,res) => {
  // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Get All Pharmacy Task'
  // #swagger.description = 'Get All Pharmacy Task'
getAllPharmacyTasks(req, res)} );

// 🔹 Endpoint untuk mengambil Pharmacy Task berdasarkan Booking ID
router.get("/:NOP", (req,res)=> {
  // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Get By NOP'
  // #swagger.description = 'Get Pharmacy Task By NOP'
getPharmacyTaskByNOP(req, res)} );

// 🔹 Endpoint untuk memperbarui Pharmacy Task berdasarkan ID
router.put("/:NOP", (req, res)=> {
   // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Update'
  // #swagger.description = 'Update Pharmacy Task By NOP' 
updatePharmacyTask(req, res);
} );

// 🔹 Endpoint untuk menghapus Pharmacy Task berdasarkan ID
router.delete("/:NOP",(req, res)=>{
  // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Delete'
  // #swagger.description = 'Delete Pharmacy Task By NOP'
deletePharmacyTask(req, res);
} );
router.get("/today/:category",(req, res)=>{
  // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Get Today'
  // #swagger.description = 'Get All Task Today'
  getAllPharmacyTasksToday(req, res);
});

router.get("/status/:status/:category",(req, res)=>{
    // #swagger.tags = ['Pharmacy']
  // #swagger.summary = 'Get Status'
  // #swagger.description = 'Get All Task By Status'
  getAllPharmacyTasksByStatus(req, res);
})

module.exports = router;
