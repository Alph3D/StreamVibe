import { API_BASE_URL } from "@/services/api";

// Helper pour logger les erreurs de manière plus visible
const handleFetchError = (err, context) => {
    console.error(`[MovieService Error] ${context}:`, err);
    return null;
};

// --- CATÉGORIES & LISTES ---
export const fetchMovieCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/categories`);
        return response.ok ? await response.json() : [];
    } catch (err) { return handleFetchError(err, 'fetchMovieCategories'); }
};

export const fetchTopRatedCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/top-rated?limit=4`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.movies || [];
    } catch (err) { return handleFetchError(err, 'fetchTopRatedCategories'); }
};

export const getPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/popular-movies?page=${page}`);
        return response.ok ? await response.json() : { movies: [] };
    } catch (err) { return { movies: [] }; }
};

// --- DÉTAILS (Films/Séries) ---
export const fetchSingleMovies = async (slug) => {
    try {
        const url = `${API_BASE_URL}/movie/${slug}`;
        const res = await fetch(url, { cache: 'no-store' });
        
        if (!res.ok) {
            console.warn(`Fetch Film failed: ${res.status} for ${url}`);
            return null;
        }
        
        const data = await res.json();
        // Injection sécurisée
        const idToUse = data?.tmdbId || data?.id;
        if (idToUse) data.vidsrcUrl = `https://vidsrc.to/embed/movie/${idToUse}`;
        
        return data;
    } catch (err) { return handleFetchError(err, 'fetchSingleMovies'); }
};

export const fetchSingleSeries = async (slug) => {
    try {
        const url = `${API_BASE_URL}/series/${slug}`;
        const res = await fetch(url, { cache: 'no-store' });
        
        if (!res.ok) {
            console.warn(`Fetch Série failed: ${res.status} for ${url}`);
            return null;
        }
        return await res.json();
    } catch (err) { return handleFetchError(err, 'fetchSingleSeries'); }
};