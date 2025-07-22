// src/controllers/loketController.js
const Loket = require('../models/loket');
/**
 * Controller untuk membuat loket baru.
 */
const createLoket = async (req, res) => {
  try {
    const loketData = req.body;
    const result = await Loket.create(loketData);
    const io = req.app.get('socketio');

    io.emit('create_loket',{
      message: "Created Loket",
      data: result,
    });
    res.status(201).json({ message: 'Loket created successfully', data: result });
  } catch (error) {
    console.error('Error creating loket:', error);
    res.status(500).json({ message: 'Failed to create loket', error: error.message });
  }
};

/**
 * Controller untuk mengambil loket berdasarkan ID.
 */
const getLoketById = async (req, res) => {
  try {
    const { loket_id } = req.params;
    const loket = await Loket.findById(loket_id);
    if (!loket) {
      return res.status(404).json({ message: 'Loket not found' });
    }
    res.status(200).json({ data: loket });
  } catch (error) {
    console.error('Error retrieving loket:', error);
    res.status(500).json({ message: 'Failed to retrieve loket', error: error.message });
  }
};

/**
 * Controller untuk mengambil semua loket.
 */
const getAllLokets = async (req, res) => {
  try {
    console.log("GET ALL LOKGET");
    const lokets = await Loket.getAll();
    console.log("LOKETS",lokets);
    res.status(200).json({ data: lokets });
  } catch (error) {
    console.error('Error retrieving all lokets:', error);
    res.status(500).json({ message: 'Failed to retrieve lokets', error: error.message });
  }
};

/**
 * Controller untuk memperbarui loket berdasarkan ID.
 */
const updateLoket = async (req, res) => {
  try {
    const { loket_id } = req.params;
    const loketData = req.body;
    const result = await Loket.update(loket_id, loketData);
    const io = req.app.get('socketio');

    io.emit('update_loket',{
      message: "Updated Loket",
      data: result,
    });
    res.status(200).json({ message: 'Loket updated successfully', data: result });
  } catch (error) {
    console.error('Error updating loket:', error);
    res.status(500).json({ message: 'Failed to update loket', error: error.message });
  }
};

/**
 * Controller untuk menghapus loket berdasarkan ID.
 */
const deleteLoket = async (req, res) => {
  try {
    const { loket_id } = req.params;
    const result = await Loket.delete(loket_id);
    const io = req.app.get('socketio');

    io.emit('delete_loket',{
      message: "Deleted Loket",
      // data: result,
    });
    res.status(200).json({ message: 'Loket deleted successfully', data: result });
  } catch (error) {
    console.error('Error deleting loket:', error);
    res.status(500).json({ message: 'Failed to delete loket', error: error.message });
  }
};

module.exports = {
  createLoket,
  getLoketById,
  getAllLokets,
  updateLoket,
  deleteLoket
};
