const path = require('path');
const axios = require('axios'); // Ajout d'axios pour appeler l'API TMDB

const Movie = require("../model/movieModel");
const Review = require("../model/reviewModel");
const { createMovieValidation } = require("../validation/movieValidation");
const { movieUploader } = require('../utils/videoUploader');

// Configuration de base pour l'image haute qualité de TMDB
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

//! Get Request
exports.allMovies = async (req, res) => {
    try {
        // On récupère les films populaires globaux depuis TMDB en français
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`);
        
        const formattedMovies = response.data.results.map(movie => ({
            _id: movie.id.toString(), // On transforme l'ID pour correspondre au format attendu par MongoDB/Next.js
            title: movie.title,
            description: movie.overview,
            thumbnail: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            duration: "2h 00m", // TMDB ne donne pas la durée sur la liste globale, on met une valeur par défaut
            views: Math.floor(movie.popularity),
            averageRating: movie.vote_average / 2, // TMDB note sur 10, ton site note sur 5
            publish_date: movie.release_date
        }));

        res.status(200).json({ status: 200, movies: formattedMovies, message: "All movies from TMDB" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

exports.singleMovie = async (req, res) => {
    const movieId = req.params.id;

    try {
        // Si l'ID est numérique, il vient de TMDB
        if (!isNaN(movieId)) {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&append_to_response=external_ids`);
            const movieData = response.data;

            const formattedMovie = {
                _id: movieData.id.toString(),
                tmdbId: movieData.id.toString(),
                imdb_id: movieData.external_ids ? movieData.external_ids.imdb_id : null,
                title: movieData.title,
                description: movieData.overview,
                thumbnail: movieData.poster_path ? `${TMDB_IMAGE_BASE}${movieData.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
                duration: movieData.runtime ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m` : "2h 00m",
                views: Math.floor(movieData.popularity) + 1,
                averageRating: movieData.vote_average / 2,
                publish_date: movieData.release_date,
                category: movieData.genres && movieData.genres.length > 0 ? movieData.genres[0].name : "Général",
                actors: [], // Optionnel : peut être peuplé via /movie/{id}/credits si nécessaire
                director: null
            };

            return res.status(200).json({ status: 200, movie: formattedMovie, message: "Movie fetch successfully from TMDB" });
        }

        // Sinon, recherche classique en base locale locale
        const movie = await Movie.findById(movieId).populate("actors director");
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        movie.views += 1;
        await movie.save();
        res.status(200).json({ status: 200, movie, message: "Movie fetch successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

exports.movieCategories = async (req, res) => {
    try {
        // Liste fixe des catégories populaires en Français
        const sampleCategories = ["Action", "Comédie", "Drame", "Science-Fiction", "Horreur"];
        const categoryImages = {};

        // On associe de fausses images génériques pour la liste des catégories
        for (const cat of sampleCategories) {
            categoryImages[cat] = [
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400",
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400"
            ];
        }

        res.status(200).json(categoryImages);
    } catch (error) {
        console.error('Error fetching movie categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.topRatedMovies = async (req, res) => {
    const { limit } = req.query;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1`);
        
        const formattedMovies = response.data.results.slice(0, parseInt(limit) || 10).map(movie => ({
            title: movie.title,
            averageRating: movie.vote_average / 2,
            thumbnail: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"
        }));

        // On organise sous une catégorie fictive "Général" ou selon la demande de ton front
        const topRatedMovies = { "Tous les films": formattedMovies };

        res.status(200).json({ status: 200, message: "top rated movies fetch successfully", movies: topRatedMovies });
    } catch (error) {
        console.error('Error fetching top-rated movies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.trendingMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        
        const formattedMovies = response.data.results.map(movie => ({
            _id: movie.id.toString(),
            title: movie.title,
            views: Math.floor(movie.popularity),
            duration: "2h 10m",
            averageRating: movie.vote_average / 2,
            thumbnail: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"
        }));

        res.status(200).json({
            status: 200,
            message: "Trending movies fetched successfully from TMDB",
            movies: formattedMovies,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500), // TMDB limite à 500 pages max
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching recent movies:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.newReleased = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        // On récupère les films actuellement au cinéma (Now Playing)
        const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        
        const formattedMovies = response.data.results.map(movie => ({
            _id: movie.id.toString(),
            title: movie.title,
            views: Math.floor(movie.popularity),
            duration: "1h 55m",
            averageRating: movie.vote_average / 2,
            thumbnail: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            publish_date: movie.release_date
        }));

        res.status(200).json({
            status: 200,
            message: "New released movies fetched successfully from TMDB",
            movies: formattedMovies,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching new released movies:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.popularMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=${page}`);
        
        const formattedMovies = response.data.results.map(movie => ({
            _id: movie.id.toString(),
            title: movie.title,
            views: Math.floor(movie.popularity),
            duration: "2h 05m",
            averageRating: movie.vote_average / 2,
            thumbnail: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image",
            publish_date: movie.release_date
        }));

        res.status(200).json({
            status: 200,
            message: "Popular movies fetched successfully from TMDB",
            movies: formattedMovies,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.getMoviesByGenre = async (req, res) => {
    const { genre } = req.params;
    try {
        const page = parseInt(req.query.page) || 1;
        
        // Mapping simple pour convertir le nom du genre texte en ID TMDB
        const genreMapping = {
            "Action": 28, "Comédie": 35, "Drame": 18, "Science-Fiction": 878, "Horreur": 27
        };
        const genreId = genreMapping[genre] || 28;

        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&with_genres=${genreId}&page=${page}`);
        
        const formattedMovies = response.data.results.map(movie => ({
            _id: movie.id.toString(),
            title: movie.title,
            views: Math.floor(movie.popularity),
            duration: "2h 00m",
            rate: movie.vote_average / 2,
            thumbnail: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"
        }));

        res.status(200).json({
            status: 200,
            message: "Movies fetched successfully by genre",
            movies: formattedMovies,
            pagination: {
                currentPage: page,
                totalPages: Math.min(response.data.total_pages, 500),
                hasNextPage: page < response.data.total_pages
            }
        });
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
};

//! Post Request
exports.createMovie = [movieUploader, createMovieValidation, async (req, res) => {
    try {
        const newMovie = await Movie.create(req.body);
        res.status(201).json({ status: 201, message: "Movie created successfully", movie: newMovie });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}];

exports.downloadMovie = async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ status: 400, message: "URL is required" });
    }
    try {
        const file = path.join(__dirname, "..", `public`, "videos", url);
        res.download(file)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "An error occurred while downloading the episode",
            error: err.message
        });
    }
};

//! Put Request
exports.updateMovie = async (req, res) => {
    const movieId = req.params.id;
    try {
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        if (createMovieValidation(req.body).error)
            return res.status(400).json({ text: createMovieValidation(req.body).error.message });

        await Movie.findByIdAndUpdate(movieId, req.body, { new: true });
        res.status(200).json({ status: 200, message: "Movie updated" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

//! Delete Request
exports.deleteMovie = async (req, res) => {
    const movieId = req.params.id;
    try {
        const movie = await Movie.findByIdAndDelete(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json({ status: 200, message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};