// /src\app\utils\api\Button.js

const HOST = process.env.NEXT_PUBLIC_API_HOST; // 🔥 Pastikan server bisa diakses dari IP lain
const PORT = process.env.NEXT_PUBLIC_API_PORT
console.log(HOST,PORT)
const BASE_URL = `http://${HOST}:${PORT}`; // Base URL API
export const updateButtonStatus = async (NOP, status, name) => {
    try {
        console.log("📡 Mengirim data ke backend:", { NOP, status, name });

        // if(status == "processed_verification"){
            // const response = await fetch(`${BASE_URL}/api`)
        // }

        const response = await fetch(`${BASE_URL}/api/button/update/medicine-type`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ NOP, status, user_id: null, name }),
        });

        console.log("✅ Status Code dari Backend:", response.status);

        const text = await response.text();
        console.log("📡 Response dari Backend:", text);

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status} - ${text}`);
        }

        return JSON.parse(text); // Pastikan respons dikonversi ke JSON
    } catch (error) {
        console.error("❌ Error saat memperbarui status:", error);
        throw error;
    }
};
