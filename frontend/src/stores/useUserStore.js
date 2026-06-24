import { create } from 'zustand';

const useUserStore = create((set) => ({
    user: null,
    loading: false,
    error: null,
    
    fetchUser: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/userData`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            // Gérer explicitement l'erreur 401 (Non connecté)
            if (response.status === 401) {
                console.warn("Utilisateur non authentifié.");
                set({ user: null, loading: false });
                return; // On arrête là, ce n'est pas une "vraie" erreur serveur
            }

            if (!response.ok) {
                throw new Error(`Erreur serveur : ${response.status}`);
            }

            const data = await response.json();
            set({ user: data.user || null, loading: false });
        } catch (error) {
            console.error("Erreur lors du chargement utilisateur:", error);
            set({ error: error.message, loading: false });
        }
    },
    
    clearUser: () => set({ user: null }),
}));

export default useUserStore;