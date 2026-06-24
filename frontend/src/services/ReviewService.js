import { API_BASE_URL } from "@/services/api";

export const fetchReviews = async (id) => {
    // Si l'ID est manquant ou undefined, on ne lance pas la requête
    if (!id) return [];

    try {
        const response = await fetch(`${API_BASE_URL}/review/${id}`);
        
        // Si le serveur répond avec une erreur (404, 500...), on retourne un tableau vide
        if (!response.ok) {
            console.warn(`Erreur lors de la récupération des avis pour ${id}:`, response.status);
            return [];
        }
        
        const data = await response.json();
        return data.reviews || []; // On s'assure de toujours retourner un tableau
    } catch (error) {
        // C'est ici que ton "Failed to fetch" est capturé
        console.error("Erreur réseau lors de fetchReviews:", error);
        return []; // On retourne un tableau vide pour ne pas faire planter l'UI
    }
};

export const addNewReview = async (data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/review/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to Add Review! Please try again later.");
        }
        
        return await response.json();
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'avis:", error);
        throw error; // On laisse le composant gérer l'erreur pour afficher un message à l'utilisateur
    }
};