const express = require("express");
const router = express.Router();
const {
  createPharmacyTask,
  getPharmacyTaskByNOP,
  getAllPharmacyTasks,
  updatePharmacyTask,
  deletePharmacyTask
} = require("../controllers/pharmacyTaskController");

// 🔹 Endpoint untuk membuat Pharmacy Task
router.post("/", createPharmacyTask);

// 🔹 Endpoint untuk mengambil semua Pharmacy Task
router.get("/", getAllPharmacyTasks);

// 🔹 Endpoint untuk mengambil Pharmacy Task berdasarkan Booking ID
router.get("/:NOP", getPharmacyTaskByNOP);

// 🔹 Endpoint untuk memperbarui Pharmacy Task berdasarkan ID
router.put("/:NOP", updatePharmacyTask);

// 🔹 Endpoint untuk menghapus Pharmacy Task berdasarkan ID
router.delete("/:NOP", deletePharmacyTask);

module.exports = router;
