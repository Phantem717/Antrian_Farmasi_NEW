/**
 * 🔹 generateFourDigitNumber
 * Fungsi untuk membuat angka 4 digit secara otomatis.
 * Jika angka yang dihasilkan kurang dari 4 digit, akan ditambahkan nol di depan (padding).
 * @returns {string} - Nomor 4 digit yang dihasilkan (misal: "0456", "1234").
 */
const generateFourDigitNumber = () => {
    // Generate angka random dari 0 - 9999
    const randomNum = Math.floor(Math.random() * 10000);
  
    // Format menjadi 4 digit dengan padding nol jika perlu
    return randomNum.toString().padStart(4, "0");
  };
  
  // Export fungsi agar bisa digunakan di file lain
  module.exports = { generateFourDigitNumber };
  