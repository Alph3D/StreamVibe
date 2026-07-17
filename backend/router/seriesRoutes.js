// backend/router/seriesRoutes.js
const express = require('express');
const router = express.Router();
const Series = require('../model/seriesModel');
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// 🔥 Récupérer les catégories de séries
router.get('/categories', async (req, res) => {
    try {
        // Récupérer les genres depuis TMDB
        const response = await axios.get('https://api.themoviedb.org/3/genre/tv/list', {
            params: {
                api_key: TMDB_API_KEY,
                language: 'fr'
            }
        });
        
        const categories = {};
        for (const genre of response.data.genres) {
            // Récupérer quelques séries pour chaque genre
            const seriesRes = await axios.get('https://api.themoviedb.org/3/discover/tv', {
                params: {
                    api_key: TMDB_API_KEY,
                    with_genres: genre.id,
                    language: 'fr',
                    page: 1,
                    limit: 5
                }
            });
            
            categories[genre.name] = seriesRes.data.results.map(s => 
                `https://image.tmdb.org/t/p/w500${s.poster_path}`
            ).filter(Boolean);
        }
        
        res.json({
            status: 200,
            categories: categories
        });
    } catch (error) {
        console.error('❌ Erreur catégories:', error.message);
        res.status(500).json({
            status: 500,
            message: 'Error fetching categories',
            error: error.message
        });
    }
});

// 🔥 Récupérer les séries top rated
router.get('/top-rated', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 4;
        
        const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
                api_key: TMDB_API_KEY,
                language: 'fr',
                page: 1
            }
        });
        
        const series = response.data.results.slice(0, limit).map(s => ({
            _id: s.id.toString(),
            title: s.name,
            description: s.overview || '',
            thumbnail: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
            views: Math.floor(Math.random() * 1000),
            averageRating: s.vote_average || 0,
            publish_date: s.first_air_date || '',
            category: 'Général',
            totalEpisodes: 0,
            imdb_id: null,
            seasons: []
        }));
        
        res.json({
            status: 200,
            series: series
        });
    } catch (error) {
        console.error('❌ Erreur top rated:', error.message);
        res.status(500).json({
            status: 500,
            message: 'Error fetching top rated series',
            error: error.message
        });
    }
});

// 🔥 Récupérer les nouvelles séries
router.get('/new-released', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        
        const response = await axios.get('https://api.themoviedb.org/3/tv/on_the_air', {
            params: {
                api_key: TMDB_API_KEY,
                language: 'fr',
                page: page
            }
        });
        
        const series = response.data.results.map(s => ({
            _id: s.id.toString(),
            title: s.name,
            description: s.overview || '',
            thumbnail: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
            views: Math.floor(Math.random() * 1000),
            averageRating: s.vote_average || 0,
            publish_date: s.first_air_date || '',
            category: 'Général',
            totalEpisodes: 0,
            imdb_id: null,
            seasons: []
        }));
        
        res.json({
            status: 200,
            series: series,
            pagination: {
                currentPage: page,
                totalPages: response.data.total_pages,
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error('❌ Erreur new released:', error.message);
        res.status(500).json({
            status: 500,
            message: 'Error fetching new released series',
            error: error.message
        });
    }
});

// 🔥 Séries populaires
router.get('/popular-series', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const language = req.query.language || 'fr';

        console.log(`🔍 Recherche de séries en ${language}...`);

        // 🔥 Essayer MongoDB d'abord
        let series = await Series.find({ language: language })
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // 🔥 Si pas de résultats, utiliser TMDB
        if (series.length === 0) {
            const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
                params: {
                    api_key: TMDB_API_KEY,
                    language: language,
                    page: page
                }
            });
            
            series = response.data.results.map(s => ({
                _id: s.id.toString(),
                title: s.name,
                description: s.overview || 'Aucune description disponible',
                thumbnail: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
                views: Math.floor(Math.random() * 1000),
                averageRating: s.vote_average || 0,
                publish_date: s.first_air_date || '',
                category: 'Général',
                totalEpisodes: 0,
                imdb_id: null,
                seasons: [],
                language: language
            }));
        }

        const total = await Series.countDocuments({ language: language });

        res.json({
            status: 200,
            message: `Popular series fetched successfully (${language})`,
            series: series,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                hasNextPage: page < Math.ceil(total / limit)
            },
            language: language
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            status: 500,
            message: 'Error fetching popular series',
            error: error.message
        });
    }
});

// 🔥 Séries tendances
router.get('/trending-series', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const language = req.query.language || 'fr';

        console.log(`🔍 Recherche de séries tendances en ${language}...`);

        // 🔥 Essayer MongoDB d'abord
        let series = await Series.find({ language: language })
            .sort({ views: -1, averageRating: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // 🔥 Si pas de résultats, utiliser TMDB
        if (series.length === 0) {
            const response = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
                params: {
                    api_key: TMDB_API_KEY,
                    language: language,
                    page: page
                }
            });
            
            series = response.data.results.map(s => ({
                _id: s.id.toString(),
                title: s.name,
                description: s.overview || 'Aucune description disponible',
                thumbnail: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
                views: Math.floor(Math.random() * 1000),
                averageRating: s.vote_average || 0,
                publish_date: s.first_air_date || '',
                category: 'Général',
                totalEpisodes: 0,
                imdb_id: null,
                seasons: [],
                language: language
            }));
        }

        const total = await Series.countDocuments({ language: language });

        res.json({
            status: 200,
            message: `Trending series fetched successfully (${language})`,
            series: series,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit) || 1,
                hasNextPage: page < Math.ceil(total / limit)
            },
            language: language
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            status: 500,
            message: 'Error fetching trending series',
            error: error.message
        });
    }
});

// 🔥 Récupérer une série par son ID
router.get('/single/:id', async (req, res) => {
    try {
        const series = await Series.findById(req.params.id)
            .populate('seasons')
            .populate('actors')
            .populate('director')
            .lean();

        if (!series) {
            // 🔥 Chercher sur TMDB
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${req.params.id}`, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: 'fr'
                }
            });
            
            const s = response.data;
            const newSeries = {
                _id: s.id.toString(),
                title: s.name,
                description: s.overview || 'Aucune description disponible',
                thumbnail: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : '',
                views: Math.floor(Math.random() * 1000),
                averageRating: s.vote_average || 0,
                publish_date: s.first_air_date || '',
                category: 'Général',
                totalEpisodes: 0,
                imdb_id: s.external_ids?.imdb_id || null,
                seasons: s.seasons?.map(season => ({
                    season_number: season.season_number,
                    episode_count: season.episode_count,
                    name: season.name
                })) || [],
                language: 'fr',
                original_language: s.original_language || 'en'
            };

            return res.json({
                status: 200,
                message: 'Series fetched from TMDB',
                series: newSeries
            });
        }

        res.json({
            status: 200,
            message: 'Series fetched successfully',
            series: series
        });
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            status: 500,
            message: 'Error fetching series',
            error: error.message
        });
    }
});

// 🔥 Route pour les langues disponibles
router.get('/languages', (req, res) => {
    res.json({
        status: 200,
        languages: [
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'it', name: 'Italiano', flag: '🇮🇹' },
            { code: 'pt', name: 'Português', flag: '🇵🇹' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' },
            { code: 'ko', name: '한국어', flag: '🇰🇷' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'zh', name: '中文', flag: '🇨🇳' }
        ]
    });
});

module.exports = router;