import useUserStore from "@/stores/useUserStore";
import { API_BASE_URL } from "@/services/api";

export const handleActivateSubscription = async (id, freeTrial, time, plan) => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/addSubscription/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ freeTrial, time, plan })
        });

        const data = await response.json();
    } catch (error) {
        console.log(error);
    };
};


export const checkSubscriptionStatus = () => {
    if (user?.subscription?.status === "active") {
        return true;
    }
    return false;
};