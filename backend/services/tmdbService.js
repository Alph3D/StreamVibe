// backend/services/tmdbService.js
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// 🔥 Récupérer les séries populaires avec filtre langue
const getPopularSeries = async (page = 1, language = 'fr') => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                page: page,
                language: language, // 🔥 Filtre la langue
                region: 'FR' // 🔥 Filtre par région France
            }
        });

        // 🔥 Filtrer pour garder seulement les séries avec un titre en français
        const frenchSeries = response.data.results.filter(series => {
            // Garder les séries qui ont un titre en français ou une description
            return series.original_language === 'fr' || 
                   series.original_language === 'en' || // Garder les séries anglaises aussi (souvent disponibles en VF)
                   series.overview && series.overview.length > 0;
        });

        return {
            status: 200,
            message: 'Popular series fetched successfully',
            series: frenchSeries.map(series => ({
                _id: series.id,
                title: series.name,
                description: series.overview || 'Aucune description disponible',
                thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
                views: Math.floor(Math.random() * 1000),
                averageRating: series.vote_average || 0,
                publish_date: series.first_air_date || new Date().toISOString().split('T')[0],
                category: series.genres?.[0]?.name || 'Général',
                totalEpisodes: 0,
                imdb_id: null,
                seasons: [],
                original_language: series.original_language
            })),
            pagination: {
                currentPage: response.data.page,
                totalPages: response.data.total_pages,
                hasNextPage: response.data.page < response.data.total_pages
            }
        };
    } catch (error) {
        console.error('❌ Erreur TMDB:', error.message);
        return {
            status: 500,
            message: 'Error fetching popular series',
            series: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasNextPage: false
            }
        };
    }
};

// 🔥 Récupérer les séries tendances avec filtre langue
const getTrendingSeries = async (page = 1, language = 'fr') => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
            params: {
                api_key: TMDB_API_KEY,
                page: page,
                language: language // 🔥 Filtre la langue
            }
        });

        const frenchSeries = response.data.results.filter(series => {
            return series.original_language === 'fr' || 
                   series.original_language === 'en' ||
                   series.overview && series.overview.length > 0;
        });

        return {
            status: 200,
            message: 'Trending series fetched successfully',
            series: frenchSeries.map(series => ({
                _id: series.id,
                title: series.name,
                description: series.overview || 'Aucune description disponible',
                thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
                views: Math.floor(Math.random() * 1000),
                averageRating: series.vote_average || 0,
                publish_date: series.first_air_date || new Date().toISOString().split('T')[0],
                category: series.genres?.[0]?.name || 'Général',
                totalEpisodes: 0,
                imdb_id: null,
                seasons: [],
                original_language: series.original_language
            })),
            pagination: {
                currentPage: response.data.page,
                totalPages: response.data.total_pages,
                hasNextPage: response.data.page < response.data.total_pages
            }
        };
    } catch (error) {
        console.error('❌ Erreur TMDB:', error.message);
        return {
            status: 500,
            message: 'Error fetching trending series',
            series: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasNextPage: false
            }
        };
    }
};

// 🔥 Récupérer les séries par genre avec filtre langue
const getSeriesByGenre = async (genreId, page = 1, language = 'fr') => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/discover/tv`, {
            params: {
                api_key: TMDB_API_KEY,
                with_genres: genreId,
                page: page,
                language: language,
                region: 'FR',
                sort_by: 'popularity.desc'
            }
        });

        return {
            status: 200,
            message: 'Series by genre fetched successfully',
            series: response.data.results.map(series => ({
                _id: series.id,
                title: series.name,
                description: series.overview || 'Aucune description disponible',
                thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
                views: Math.floor(Math.random() * 1000),
                averageRating: series.vote_average || 0,
                publish_date: series.first_air_date || new Date().toISOString().split('T')[0],
                category: series.genres?.[0]?.name || 'Général',
                totalEpisodes: 0,
                imdb_id: null,
                seasons: [],
                original_language: series.original_language
            })),
            pagination: {
                currentPage: response.data.page,
                totalPages: response.data.total_pages,
                hasNextPage: response.data.page < response.data.total_pages
            }
        };
    } catch (error) {
        console.error('❌ Erreur TMDB:', error.message);
        return {
            status: 500,
            message: 'Error fetching series by genre',
            series: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasNextPage: false
            }
        };
    }
};

// 🔥 Recherche de séries avec filtre langue
const searchSeries = async (query, page = 1, language = 'fr') => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
            params: {
                api_key: TMDB_API_KEY,
                query: query,
                page: page,
                language: language,
                region: 'FR'
            }
        });

        return {
            status: 200,
            message: 'Search results fetched successfully',
            series: response.data.results.map(series => ({
                _id: series.id,
                title: series.name,
                description: series.overview || 'Aucune description disponible',
                thumbnail: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
                views: Math.floor(Math.random() * 1000),
                averageRating: series.vote_average || 0,
                publish_date: series.first_air_date || new Date().toISOString().split('T')[0],
                category: 'Général',
                totalEpisodes: 0,
                imdb_id: null,
                seasons: [],
                original_language: series.original_language
            })),
            pagination: {
                currentPage: response.data.page,
                totalPages: response.data.total_pages,
                hasNextPage: response.data.page < response.data.total_pages
            }
        };
    } catch (error) {
        console.error('❌ Erreur TMDB:', error.message);
        return {
            status: 500,
            message: 'Error searching series',
            series: [],
            pagination: {
                currentPage: 1,
                totalPages: 0,
                hasNextPage: false
            }
        };
    }
};

module.exports = {
    getPopularSeries,
    getTrendingSeries,
    getSeriesByGenre,
    searchSeries
};