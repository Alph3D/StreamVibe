import { API_BASE_URL } from "@/services/api";

export const sendSupportRequest = async (data) => {
    const response = await fetch(`${API_BASE_URL}/support/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(response.status === 500
            ? "Server error! Please try again later."
            : "Failed to send message! Please try again later.");
    }
};