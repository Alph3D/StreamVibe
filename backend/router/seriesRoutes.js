const express = require('express');
const { 
    getAllSeries, 
    createSeries, 
    getSeries, 
    singleSeries, // Assure-toi que cette fonction est bien importée
    updateSeries, 
    deleteSeries, 
    topRatedSeries, 
    trendingSeries, 
    seriesCategories, 
    newReleasedSeries, 
    popularSeries, 
    getSeriesByGenre 
} = require('../controller/seriesController');

const ValidateObjectId = require('../middleware/ValidateObjectId');
const Authenticate = require('../middleware/Authenticate');
const Authorize = require('../middleware/Authorize');

const router = express.Router();

// Routes de base
router
    .route('/')
    .get(getAllSeries)
    .post([Authenticate, Authorize(["admin"])], createSeries);

// Routes spécifiques
router.get("/categories", seriesCategories);
router.get("/top-rated", topRatedSeries);
router.get("/trending-series", trendingSeries);
router.get("/new-released", newReleasedSeries);
router.get("/popular-series", popularSeries);
router.get("/seriesByGenre/:genre", getSeriesByGenre);

// Route pour TMDB (IDs numériques) - PAS de ValidateObjectId ici
router.get("/single/:id", singleSeries);

// Route pour les séries locales (IDs MongoDB) - Avec ValidateObjectId
router
    .route('/:id')
    .get(ValidateObjectId, getSeries)
    .put([Authenticate, Authorize(["admin"])], ValidateObjectId, updateSeries)
    .delete([Authenticate, Authorize(["admin"])], ValidateObjectId, deleteSeries);

module.exports = router;