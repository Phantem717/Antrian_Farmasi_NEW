import CryptoJS from "crypto-js";

export async function POST(req) {
    try {
        // 🔹 Ambil `registrationNo` dari body request
        const { registrationNo } = await req.json();

        // 🔹 Validasi jika `registrationNo` tidak ada
        if (!registrationNo) {
            return Response.json({ message: "registrationNo is required" }, { status: 400 });
        }

        // 🔹 Konfigurasi API tujuan
        const apiUrl = "http://192.168.6.85/api/medinfras/compound-info";
        const serverConsId = "21011919";
        const serverAccessToken = "AMqey0yAVrqmhR82RMIWB3zqMvpRP0zaaOheEeq2tmmcEtRYNj2";
        const serverSecretKey = "BeatoCarloAcutis";
        const timestamp = Math.floor(Date.now() / 1000).toString();

        // 🔹 Buat tanda tangan HMAC SHA256
        const dataToSign = `${serverConsId}&${timestamp}&${serverAccessToken}`;
        const signature = CryptoJS.HmacSHA256(dataToSign, serverSecretKey);
        const signatureBase64 = CryptoJS.enc.Base64.stringify(signature);

        // 🔹 Konfigurasi Header
        const headers = {
            "X-Access-Token": serverAccessToken,
            "X-Cons-Id": serverConsId,
            "X-Timestamp": timestamp,
            "X-Signature": signatureBase64,
            "Content-Type": "application/json"
        };

        // 🔹 Kirim Request ke API tujuan (POST dengan body)
        const apiResponse = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ registrationNo }) // Kirim registrationNo dalam body
        });

        const responseData = await apiResponse.json();

        // 🔹 Kembalikan hasil response ke frontend
        return Response.json({
            status: responseData.status,
            message: responseData.message === "Ada racikan" ? "Racikan" : "Non - Racikan",
            data: responseData.data
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Error fetching compound info:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
