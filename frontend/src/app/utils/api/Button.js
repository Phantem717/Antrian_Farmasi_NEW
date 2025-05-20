// /src\app\utils\api\Button.js
const BASE_URL = 'http://172.16.21.214:5000'; // Base URL API

export const updateButtonStatus = async (booking_id, status, name) => {
    try {
        console.log("📡 Mengirim data ke backend:", { booking_id, status, name });

        // if(status == "processed_verification"){
            // const response = await fetch(`${BASE_URL}/api`)
        // }

        const response = await fetch(`${BASE_URL}/api/button/update/medicine-type`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_id, status, user_id: null, name }),
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
