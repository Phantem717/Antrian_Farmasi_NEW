// EmailAPI.js

// 1. Get Host and Port from Environment (Frontend)
const HOST = process.env.NEXT_PUBLIC_API_HOST;
const PORT = process.env.NEXT_PUBLIC_API_PORT;

// Ensure BASE_URL is correctly defined using the environment variables
const BASE_URL = `http://${HOST}:${PORT}/api/email/send-certificate`; 

console.log(`Email API Base URL: ${BASE_URL}`);

const EmailAPI = {
    /**
     * Sends the email request (containing PDF data and recipient info) 
     * to the backend API endpoint.
     * @param {Object} payload - The data object to send (email, name, pdfBase64).
     */
    sendEmail: async (payload) => {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary authorization headers here if required
            },
            body: JSON.stringify(payload),
        });

        // Check if the response was successful (HTTP status 200-299)
        if (!response.ok) {
            // Throw an error if the backend responded with a failure status
            const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
            throw new Error(`Email sending failed: ${response.status} - ${errorData.message}`);
        }

        return await response.json();
    },
};

export default EmailAPI;