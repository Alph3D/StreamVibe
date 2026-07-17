// frontend/services/api.js

// 🔥 URL CODESPACE - CORRECTE
const CODESPACE_URL = 'https://scaling-space-funicular-g4pvv76jq6g52vw7p-5000.app.github.dev';

// 🔥 Détection de l'environnement
const isServer = typeof window === "undefined";

// 🔥 Construction de l'URL de base
const getBaseUrl = () => {
    // En serveur (Next.js SSR)
    if (isServer) {
        return `${CODESPACE_URL}/api`;
    }
    
    // 🔥 En Codespace (client) - UTILISER L'URL CORRECTE
    const hostname = window.location.hostname;
    console.log('🌍 Hostname:', hostname);
    
    // Si on est sur un Codespace (hostname contient -3000 ou -5000)
    if (hostname.includes('-3000') || hostname.includes('-5000')) {
        // 🔥 FORCER l'URL Codespace correcte
        console.log('🌍 URL Codespace forcée:', `${CODESPACE_URL}/api`);
        return `${CODESPACE_URL}/api`;
    }
    
    // Fallback local
    console.log('🌍 URL locale: http://localhost:5000/api');
    return "http://localhost:5000/api";
};

export const API_BASE_URL = getBaseUrl();

// 🔥 URL pour les images TMDB
export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// 🔥 Fonction pour construire l'URL d'une image TMDB
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${TMDB_IMAGE_URL}${path}`;
    return `${TMDB_IMAGE_URL}/${path}`;
};

// 🔥 Fonction pour récupérer les données de l'API
export const fetchFromAPI = async (endpoint) => {
    try {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`📡 Fetch: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✅ Données reçues:`, data?.series?.length || 0, 'éléments');
        return data;
    } catch (error) {
        console.error(`❌ Erreur API (${endpoint}):`, error.message);
        return null;
    }
};

// 🔥 Récupérer les séries populaires
export const getPopularSeries = async (page = 1) => {
    return fetchFromAPI(`/series/popular-series?page=${page}`);
};

// 🔥 Récupérer les séries tendances
export const getTrendingSeries = async (page = 1) => {
    return fetchFromAPI(`/series/trending-series?page=${page}`);
};

// 🔥 Récupérer une série par son slug
export const fetchSingleSeries = async (slug) => {
    return fetchFromAPI(`/series/single/${slug}`);
};

// 🔥 Récupérer les films populaires
export const getPopularMovies = async (page = 1) => {
    return fetchFromAPI(`/movie/popular-movies?page=${page}`);
};

// 🔥 Log pour debug
console.log('🌍 API_BASE_URL:', API_BASE_URL);
console.log('🌍 CODESPACE_URL:', CODESPACE_URL);

export default {
    API_BASE_URL,
    TMDB_IMAGE_URL,
    getImageUrl,
    getPopularSeries,
    getTrendingSeries,
    fetchSingleSeries,
    getPopularMovies,
    fetchFromAPI
};