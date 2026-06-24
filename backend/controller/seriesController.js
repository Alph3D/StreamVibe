const axios = require('axios');
const Review = require('../model/reviewModel');
const Series = require('../model/seriesModel');
const Episodes = require('../model/episodeModel');
const { seriesUploader } = require('../utils/videoUploader');
const { createSeriesValidation } = require('../validation/seriesValidation');

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const TMDB_API_URL = "https://api.themoviedb.org/3";

// Fonction utilitaire pour uniformiser les données venant de TMDB
const formatTmdbSeries = (tvData) => ({
    _id: tvData.id.toString(),
    title: tvData.name || tvData.title,
    description: tvData.overview || "Aucune description disponible.",
    thumbnail: tvData.poster_path ? `${TMDB_IMAGE_BASE}${tvData.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
    views: Math.floor(tvData.popularity) || 0,
    averageRating: tvData.vote_average ? tvData.vote_average / 2 : 0,
    publish_date: tvData.first_air_date || "N/A",
    category: tvData.genres && tvData.genres.length > 0 ? tvData.genres[0].name : "Général",
    totalEpisodes: tvData.number_of_episodes || 0,
    imdb_id: tvData.external_ids ? tvData.external_ids.imdb_id : null,
    seasons: tvData.seasons ? tvData.seasons.map(s => ({
        name: s.name,
        episodeCount: s.episode_count,
        seasonNumber: s.season_number
    })) : []
});

exports.getAllSeries = async (req, res) => {
    try {
        const response = await axios.get(`${TMDB_API_URL}/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`);
        const formattedSeries = response.data.results.map(tv => formatTmdbSeries(tv));
        res.status(200).json({ status: 'success', total: formattedSeries.length, series: formattedSeries });
    } catch (err) {
        res.status(500).json({ status: '500', message: err.message });
    }
};

exports.singleSeries = async (req, res) => {
    const seriesId = req.params.id;
    try {
        // Si l'ID est numérique, on interroge TMDB directement
        if (/^\d+$/.test(seriesId)) {
            const response = await axios.get(`${TMDB_API_URL}/tv/${seriesId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&append_to_response=external_ids`);
            return res.status(200).json({ 
                status: 200, 
                series: formatTmdbSeries(response.data), 
                message: "Series fetched successfully from TMDB" 
            });
        }
        
        // Sinon, recherche dans MongoDB
        const series = await Series.findById(seriesId)
            .populate("director actors")
            .populate({ path: 'seasons', model: 'Seasons', populate: { path: 'episodes', model: 'Episodes' } });
            
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
        // Correction : Utilisation d'une Regex pour une vérification numérique stricte
        if (/^\d+$/.test(seriesId)) {
            const response = await axios.get(`${TMDB_API_URL}/tv/${seriesId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&append_to_response=external_ids`);
            return res.status(200).json({ 
                status: 200, 
                message: "Series fetched successfully from TMDB", 
                series: formatTmdbSeries(response.data), 
                pictures: {} 
            });
        }
        
        // Recherche dans MongoDB pour les IDs de la base de données
        const series = await Series.findById(seriesId)
            .populate({ path: 'director', select: 'fullName birthPlace directorId profile' })
            .populate({ path: 'actors', select: 'actorId profile fullName' });
            
        if (!series) return res.status(404).json({ status: 404, message: "Series not found" });
        
        const episodes = await Episodes.find({ series: seriesId }).select('seasonNumber episodeNumber pictures');
        
        const groupedPictures = episodes.reduce((acc, ep) => {
            if (!acc[ep.seasonNumber]) acc[ep.seasonNumber] = {};
            if (!acc[ep.seasonNumber][ep.episodeNumber]) acc[ep.seasonNumber][ep.episodeNumber] = [];
            acc[ep.seasonNumber][ep.episodeNumber].push(...ep.pictures);
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
        res.status(500).json({ status: '500', message: err.message });
    }
};

exports.seriesCategories = async (req, res) => {
    try {
        const sampleCategories = ["Action & Adventure", "Comédie", "Drame", "Sci-Fi & Fantasy", "Crime"];
        const categoryImages = {};
        for (const cat of sampleCategories) {
            categoryImages[cat] = ["https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400", "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400"];
        }
        res.status(200).json({ status: 200, message: "series categories fetch successfully", categories: categoryImages });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

exports.topRatedSeries = async (req, res) => {
    const { limit } = req.query;
    try {
        const response = await axios.get(`${TMDB_API_URL}/tv/top_rated?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`);
        const formattedSeries = response.data.results.slice(0, parseInt(limit) || 10).map(tv => formatTmdbSeries(tv));
        res.status(200).json({ status: 200, message: "Top rated series fetched successfully", series: { "Toutes les séries": formattedSeries } });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.trendingSeries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`${TMDB_API_URL}/trending/tv/week?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        const formattedSeries = response.data.results.map(tv => formatTmdbSeries(tv));
        res.status(200).json({ status: 200, message: "Trending series fetched successfully", series: formattedSeries, pagination: { currentPage: page, totalPages: Math.min(response.data.total_pages, 500), hasNextPage: page < response.data.total_pages } });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.newReleasedSeries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`${TMDB_API_URL}/tv/on_the_air?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        const formattedSeries = response.data.results.map(tv => formatTmdbSeries(tv));
        res.status(200).json({ status: 200, message: "New released series fetched successfully", series: formattedSeries, pagination: { currentPage: page, totalPages: Math.min(response.data.total_pages, 500), hasNextPage: page < response.data.total_pages } });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.popularSeries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`${TMDB_API_URL}/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        const formattedSeries = response.data.results.map(tv => formatTmdbSeries(tv));
        res.status(200).json({ status: 200, message: "Popular series fetched successfully", series: formattedSeries, pagination: { currentPage: page, totalPages: Math.min(response.data.total_pages, 500), hasNextPage: page < response.data.total_pages } });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.getSeriesByGenre = async (req, res) => {
    const { genre } = req.params;
    try {
        const page = parseInt(req.query.page) || 1;
        const genreMapping = { "Action & Adventure": 10759, "Comédie": 35, "Drame": 18, "Sci-Fi & Fantasy": 10765, "Crime": 80 };
        const genreId = genreMapping[genre] || 18;
        const response = await axios.get(`${TMDB_API_URL}/discover/tv?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}`);
        const formattedSeries = response.data.results.map(tv => formatTmdbSeries(tv));
        res.status(200).json({ status: 200, message: "Series fetched successfully by genre", series: formattedSeries, pagination: { currentPage: page, totalPages: Math.min(response.data.total_pages, 500), hasNextPage: page < response.data.total_pages } });
    } catch (error) {
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
};

exports.createSeries = [seriesUploader, createSeriesValidation, async (req, res) => {
    try {
        const newSeries = await Series.create(req.body);
        res.status(201).json({ status: '201', series: newSeries });
    } catch (err) {
        res.status(500).json({ status: '500', message: err.message });
    }
}];

exports.updateSeries = async (req, res) => {
    try {
        const series = await Series.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ status: 'success', data: { series } });
    } catch (err) {
        res.status(500).json({ status: '500', message: err.message });
    }
};

exports.deleteSeries = async (req, res) => {
    try {
        const series = await Series.findByIdAndDelete(req.params.id);
        if (!series) return res.status(404).json({ status: 404, message: "Series not found" });
        res.status(200).json({ status: '200', message: "Series deleted successfully", data: null });
    } catch (err) {
        res.status(500).json({ status: '500', message: err.message });
    }
};