const axios = require('axios'); // Ajout d'axios pour appeler l'API TMDB
const Review = require('../model/reviewModel');
const Series = require('../model/seriesModel');
const Episodes = require('../model/episodeModel');
const { seriesUploader } = require('../utils/videoUploader');
const { createSeriesValidation } = require('../validation/seriesValidation');

// Configuration de base pour l'image haute qualité de TMDB
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

exports.getAllSeries = async (req, res) => {
    try {
        // Récupère les séries populaires globales sur TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`);
        
        const formattedSeries = response.data.results.map(tv => ({
            _id: tv.id.toString(),
            title: tv.name,
            description: tv.overview,
            thumbnail: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            views: Math.floor(tv.popularity),
            averageRating: tv.vote_average / 2,
            publish_date: tv.first_air_date
        }));

        res.status(200).json({
            status: 'success',
            total: formattedSeries.length,
            series: formattedSeries
        });
    } catch (err) {
        res.status(500).json({
            status: '500',
            message: err.message
        });
    }
};

exports.singleSeries = async (req, res) => {
    const seriesId = req.params.id;

    try {
        // Si l'ID est numérique, il provient de TMDB
        if (!isNaN(seriesId)) {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`);
            const tvData = response.data;

            const formattedSeries = {
                _id: tvData.id.toString(),
                title: tvData.name,
                description: tvData.overview,
                thumbnail: tvData.poster_path ? `${TMDB_IMAGE_BASE}${tvData.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
                views: Math.floor(tvData.popularity) + 1,
                averageRating: tvData.vote_average / 2,
                publish_date: tvData.first_air_date,
                category: tvData.genres && tvData.genres.length > 0 ? tvData.genres[0].name : "Général",
                totalEpisodes: tvData.number_of_episodes || 0,
                seasons: tvData.seasons ? tvData.seasons.map(s => ({
                    name: s.name,
                    episodeCount: s.episode_count,
                    seasonNumber: s.season_number
                })) : []
            };

            return res.status(200).json({ status: 200, series: formattedSeries, message: "Series fetched successfully from TMDB" });
        }

        const series = await Series.findById(seriesId).populate("director actors").populate({ path: 'seasons', model: 'Seasons', populate: { path: 'episodes', model: 'Episodes' } });
        if (!series) return res.status(404).json({ status: 404, message: "Series not found" });

        series.views += 1;
        await series.save();

        res.status(200).json({ status: 200, series, message: "Series fetch successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getSeries = async (req, res) => {
    const seriesId = req.params.id;
    try {
        if (!isNaN(seriesId)) {
            const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR`);
            const tvData = response.data;

            const formattedSeries = {
                _id: tvData.id.toString(),
                title: tvData.name,
                description: tvData.overview,
                thumbnail: tvData.poster_path ? `${TMDB_IMAGE_BASE}${tvData.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
                views: Math.floor(tvData.popularity) + 1,
                averageRating: tvData.vote_average / 2,
                publish_date: tvData.first_air_date,
                director: [],
                actors: []
            };

            return res.status(200).json({
                status: 200,
                message: "Series fetched successfully from TMDB",
                series: formattedSeries,
                pictures: {}
            });
        }

        const series = await Series.findById(seriesId)
            .populate({ path: 'director', select: 'fullName birthPlace directorId profile' })
            .populate({ path: 'actors', select: 'actorId profile fullName' });

        if (!series) return res.status(404).json({ status: 404, message: "Series not found" });

        const episodes = await Episodes.find({ series: seriesId }).select('seasonNumber episodeNumber pictures');

        const groupedPictures = episodes.reduce((acc, episode) => {
            if (!acc[episode.seasonNumber]) acc[episode.seasonNumber] = {};
            if (!acc[episode.seasonNumber][episode.episodeNumber]) acc[episode.seasonNumber][episode.episodeNumber] = [];
            acc[episode.seasonNumber][episode.episodeNumber].push(...episode.pictures);
            return acc;
        }, {});

        series.views += 1;
        await series.save();

        res.status(200).json({
            status: 200,
            message: "Series fetched successfully",
            series,
            pictures: groupedPictures
        });
    } catch (err) {
        res.status(500).json({
            status: '500',
            message: err.message
        });
    }
};

exports.seriesCategories = async (req, res) => {
    try {
        const sampleCategories = ["Action & Adventure", "Comédie", "Drame", "Sci-Fi & Fantasy", "Crime"];
        const categoryImages = {};

        for (const cat of sampleCategories) {
            categoryImages[cat] = [
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400"
            ];
        }

        res.status(200).json({ status: 200, message: "series categories fetch successfully", categories: categoryImages });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

exports.topRatedSeries = async (req, res) => {
    const { limit } = req.query;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`);
        
        const formattedSeries = response.data.results.slice(0, parseInt(limit) || 10).map(tv => ({
            title: tv.name,
            averageRating: tv.vote_average / 2,
            thumbnail: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"
        }));

        const topRatedSeries = { "Toutes les séries": formattedSeries };

        res.status(200).json({ status: 200, message: "Top rated series fetched successfully", series: topRatedSeries });
    } catch (error) {
        console.error('Error fetching top-rated series:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.trendingSeries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        
        const formattedSeries = response.data.results.map(tv => ({
            _id: tv.id.toString(),
            title: tv.name,
            views: Math.floor(tv.popularity),
            totalEpisodes: "Multi-Episodique",
            averageRating: tv.vote_average / 2,
            thumbnail: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"
        }));

        res.status(200).json({
            status: 200,
            message: "Trending series fetched successfully from TMDB",
            series: formattedSeries,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching recent series:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.newReleasedSeries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        // Séries en cours de diffusion (On The Air) sur TMDB
        const response = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        
        const formattedSeries = response.data.results.map(tv => ({
            _id: tv.id.toString(),
            title: tv.name,
            views: Math.floor(tv.popularity),
            totalEpisodes: "En cours",
            averageRating: tv.vote_average / 2,
            thumbnail: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            publish_date: tv.first_air_date
        }));

        res.status(200).json({
            status: 200,
            message: "New released series fetched successfully from TMDB",
            series: formattedSeries,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching new released series:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.popularSeries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        
        const formattedSeries = response.data.results.map(tv => ({
            _id: tv.id.toString(),
            title: tv.name,
            views: Math.floor(tv.popularity),
            totalEpisodes: "Populaire",
            averageRating: tv.vote_average / 2,
            thumbnail: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            publish_date: tv.first_air_date
        }));

        res.status(200).json({
            status: 200,
            message: "Popular series fetched successfully from TMDB",
            series: formattedSeries,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching popular series:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.getSeriesByGenre = async (req, res) => {
    const { genre } = req.params;
    try {
        const page = parseInt(req.query.page) || 1;
        
        // Mapping textuel vers IDs de genres TMDB pour les séries (TV)
        const genreMapping = {
            "Action & Adventure": 10759, "Comédie": 35, "Drame": 18, "Sci-Fi & Fantasy": 10765, "Crime": 80
        };
        const genreId = genreMapping[genre] || 18;

        const response = await axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}`);
        
        const formattedSeries = response.data.results.map(tv => ({
            _id: tv.id.toString(),
            title: tv.name,
            totalEpisodes: "Série",
            duration: "En cours",
            rate: tv.vote_average / 2,
            thumbnail: tv.poster_path ? `${TMDB_IMAGE_BASE}${tv.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"
        }));

        res.status(200).json({
            status: 200,
            message: "Series fetched successfully by genre",
            series: formattedSeries,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching series by genre:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
};

//! Post Request
exports.createSeries = [seriesUploader, createSeriesValidation, async (req, res) => {
    try {
        const newSeries = await Series.create(req.body);
        res.status(201).json({
            status: '201',
            series: newSeries
        });
    } catch (err) {
        res.status(500).json({
            status: '500',
            message: err.message
        });
    }
}];

exports.updateSeries = async (req, res) => {
    try {
        const series = await Series.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: { series }
        });
    } catch (err) {
        res.status(500).json({
            status: '500',
            message: err.message
        });
    }
};

exports.deleteSeries = async (req, res) => {
    try {
        const series = await Series.findByIdAndDelete(req.params.id);
        if (!series) return res.status(404).json({ status: 404, message: "Series not found" });

        res.status(200).json({
            status: '200',
            message: "Series deleted successfully",
            data: null
        });
    } catch (err) {
        res.status(500).json({
            status: '500',
            message: err.message
        });
    }
};