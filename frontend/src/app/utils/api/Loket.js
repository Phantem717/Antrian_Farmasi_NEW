import axios from "axios";

const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
const LoketAPI = {
  // ✅ Ambil Semua Loket
  getAllLokets: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/loket/`);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching all lokets:", error);
      throw error;
    }
  },

  // ✅ Ambil Detail Loket Berdasarkan ID
  getLoketById: async (loketId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/loket/${loketId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching loket with ID ${loketId}:`, error);
      throw error;
    }
  },

  // ✅ Perbarui Status Loket dengan format yang benar
  updateLoket: async (loketId, loketName, description, status) => {
    if (!loketId || !loketName || !description || !status) {
      console.error(`❌ ERROR: Data tidak valid! loketId: ${loketId}, loketName: ${loketName}, description: ${description}, status: ${status}`);
      return;
    }

    try {
      const updatedData = {
        loket_name: loketName,
        description: description,
        status: status
      };

      console.log(`🔄 Mengupdate Loket ID: ${loketId} dengan data:`, updatedData);

      const response = await axios.put(
        `${BASE_URL}/api/loket/${loketId}`,
        updatedData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(`✅ Loket ${loketId} berhasil diperbarui!`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating loket with ID ${loketId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ Hapus Loket Berdasarkan ID
  deleteLoket: async (loketId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/loket/${loketId}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting loket with ID ${loketId}:`, error);
      throw error;
    }
  },
};

export default LoketAPI;
