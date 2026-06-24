// services/SeriesService.js
import { API_BASE_URL } from "@/services/api";

// Fonction utilitaire pour gérer les réponses API
const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erreur API");
        return data;
    }
    
    throw new Error(`Serveur a renvoyé : ${response.status} ${response.statusText}`);
};

export const fetchSeriesCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/categories`);
        const data = await handleResponse(response);
        return data.categories || [];
    } catch (error) {
        console.error('Error fetching series categories:', error);
        return [];
    }
};

export const fetchTopRatedCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/top-rated?limit=4`);
        const data = await handleResponse(response);
        return data.series || [];
    } catch (error) {
        console.error('Error fetching top rated series:', error);
        return [];
    }
};

// 🔧 CORRECTION : getTrendingSeries
export const getTrendingSeries = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/trending-series?page=${page}`);
        const data = await handleResponse(response);
        
        console.log("📊 Données brutes de trending-series:", data);
        
        // 🔧 Si les données sont déjà dans le bon format, les retourner
        if (data.series && Array.isArray(data.series)) {
            return data;
        }
        
        // 🔧 Si les données sont un tableau directement
        if (Array.isArray(data)) {
            return { series: data };
        }
        
        // 🔧 Si les données sont dans une autre propriété
        if (data.data && Array.isArray(data.data)) {
            return { series: data.data };
        }
        
        // 🔧 Si les données sont dans results (format TMDB)
        if (data.results && Array.isArray(data.results)) {
            return { series: data.results };
        }
        
        // 🔧 Fallback : retourner un tableau vide
        console.warn("⚠️ Format de données inattendu pour trending-series:", data);
        return { series: [] };
    } catch (error) {
        console.error("Error fetching trending series:", error);
        return { series: [] };
    }
};

export const getNewReleasedSeries = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/new-released?page=${page}`);
        const data = await handleResponse(response);
        
        // Même logique pour new-released
        if (data.series && Array.isArray(data.series)) {
            return data;
        }
        if (Array.isArray(data)) {
            return { series: data };
        }
        if (data.data && Array.isArray(data.data)) {
            return { series: data.data };
        }
        if (data.results && Array.isArray(data.results)) {
            return { series: data.results };
        }
        return { series: [] };
    } catch (error) {
        console.error("Error fetching new released series:", error);
        return { series: [] };
    }
};

export const getPopularSeries = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/popular-series?page=${page}`);
        const data = await handleResponse(response);
        
        // Même logique pour popular-series
        if (data.series && Array.isArray(data.series)) {
            return data;
        }
        if (Array.isArray(data)) {
            return { series: data };
        }
        if (data.data && Array.isArray(data.data)) {
            return { series: data.data };
        }
        if (data.results && Array.isArray(data.results)) {
            return { series: data.results };
        }
        return { series: [] };
    } catch (error) {
        console.error("Error fetching popular series:", error);
        return { series: [] };
    }
};

export const fetchSingleSeries = async (id) => {
    try {
        const res = await fetch(`${API_BASE_URL}/series/single/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            const fallback = await fetch(`${API_BASE_URL}/series/${id}`, { cache: 'no-store' });
            if (!fallback.ok) return null;
            return await fallback.json();
        }
        return await handleResponse(res);
    } catch (error) {
        console.error('Error fetching single series:', error);
        return null;
    }
};

export const fetchSingleEpisode = async (series, season, episode) => {
    try {
        const res = await fetch(`${API_BASE_URL}/episode/${series}/${season}/${episode}`);
        const data = await handleResponse(res);
        return data.episode || null;
    } catch (error) {
        console.error("Error fetching single episode:", error);
        return null;
    }
};

export const fetchGenreSeries = async (genre, page = 1, topRated = false) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/seriesByGenre/${genre}?page=${page}&topRated=${topRated}`);
        const data = await handleResponse(response);
        
        if (data.series && Array.isArray(data.series)) {
            return data;
        }
        if (Array.isArray(data)) {
            return { series: data };
        }
        if (data.data && Array.isArray(data.data)) {
            return { series: data.data };
        }
        if (data.results && Array.isArray(data.results)) {
            return { series: data.results };
        }
        return { series: [] };
    } catch (error) {
        console.error("Error fetching genre series:", error);
        return { series: [] };
    }
};

export const downloadEpisodeApi = async (url) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episode/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) throw new Error("Erreur téléchargement");
        return response;
    } catch (error) {
        console.error('Download error:', error);
        return null;
    }
};