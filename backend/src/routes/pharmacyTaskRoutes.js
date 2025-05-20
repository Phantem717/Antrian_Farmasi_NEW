const express = require("express");
const router = express.Router();
const {
  createPharmacyTask,
  getPharmacyTaskByBookingId,
  getAllPharmacyTasks,
  updatePharmacyTask,
  deletePharmacyTask
} = require("../controllers/pharmacyTaskController");

// 🔹 Endpoint untuk membuat Pharmacy Task
router.post("/", createPharmacyTask);

// 🔹 Endpoint untuk mengambil semua Pharmacy Task
router.get("/", getAllPharmacyTasks);

// 🔹 Endpoint untuk mengambil Pharmacy Task berdasarkan Booking ID
router.get("/:booking_id", getPharmacyTaskByBookingId);

// 🔹 Endpoint untuk memperbarui Pharmacy Task berdasarkan ID
router.put("/:booking_id", updatePharmacyTask);

// 🔹 Endpoint untuk menghapus Pharmacy Task berdasarkan ID
router.delete("/:booking_id", deletePharmacyTask);

module.exports = router;
