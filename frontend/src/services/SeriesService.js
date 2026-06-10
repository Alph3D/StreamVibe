// Correction de l'import : on utilise un chemin relatif direct vers api.js dans le même dossier
import { API_BASE_URL } from "@/services/api";

export const fetchSeriesCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/categories`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.categories || [];
    } catch (error) {
        console.error('Error fetching series categories:', error);
        return [];
    }
};


export const fetchTopRatedCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/top-rated?limit=4`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.series || [];
    } catch (error) {
        console.error('Error fetching top rated series:', error);
        return [];
    }
}


export const getTrendingSeries = async (currentPage, page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/trending-series?page=${currentPage || page || 1}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data || { series: [] };
    } catch (error) {
        console.error("Error fetching trending series:", error);
        return { series: [] }; // Retourne un objet safe pour éviter le crash du .map() sur le front
    }
}

export const getNewReleasedSeries = async (currentPage, page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/new-released?page=${currentPage || page || 1}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data || { series: [] };
    } catch (error) {
        console.error("Error fetching new released series:", error);
        return { series: [] }; // Retourne un objet safe
    }
}

export const getPopularSeries = async (currentPage, page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/popular-series?page=${currentPage || page || 1}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data || { series: [] };
    } catch (error) {
        console.error("Error fetching popular series:", error);
        return { series: [] }; // Retourne un objet safe
    }
}

export const fetchSingleSeries = async (slug) => {
    try {
        const res = await fetch(`${API_BASE_URL}/series/${slug}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching single series:', error);
        return null;
    }
}

export const fetchSingleEpisode = async (series, season, episode) => {
    try {
        const res = await fetch(`${API_BASE_URL}/episode/${series}/${season}/${episode}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.episode || null;
    } catch (error) {
        console.error("Error fetching single episode:", error);
        return null;
    }
}


export const downloadEpisodeApi = async (url) => {
    try {
        const response = await fetch(`${API_BASE_URL}/episode/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error('Download error:', error);
        return null;
    }
};

export const fetchGenreSeries = async (genre, currentPage, page, topRated) => {
    try {
        const response = await fetch(`${API_BASE_URL}/series/seriesByGenre/${genre}?page=${currentPage || page || 1}&topRated=${topRated}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data || { series: [] };
    } catch (error) {
        console.error("Error fetching genre series:", error);
        return { series: [] };
    }
}