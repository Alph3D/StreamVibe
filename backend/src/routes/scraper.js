// backend/src/routes/scraper.js
const express = require('express');
const router = express.Router();
const { scrapeVideo, scrapeAllSources, SOURCES } = require('../services/scraperService');

// 🔥 Route principale de scraping
router.get('/scrape', async (req, res) => {
    const { 
        id, 
        type = 'movie', 
        season = 1, 
        episode = 1, 
        lang = 'fr', 
        source = 'multiembed' 
    } = req.query;

    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID requis (tmdbId ou imdbId)' 
        });
    }

    const result = await scrapeVideo({
        id,
        type,
        season: parseInt(season),
        episode: parseInt(episode),
        lang,
        source
    });

    res.json(result);
});

// 🔥 Route pour scraper avec toutes les sources
router.get('/scrape/all', async (req, res) => {
    const { id, type = 'movie', season = 1, episode = 1, lang = 'fr' } = req.query;

    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID requis' 
        });
    }

    const result = await scrapeAllSources({
        id,
        type,
        season: parseInt(season),
        episode: parseInt(episode),
        lang
    });

    res.json(result);
});

// 🔥 Route pour lister les sources disponibles
router.get('/sources', (req, res) => {
    res.json({
        success: true,
        sources: Object.keys(SOURCES).map(key => ({
            key: key,
            name: SOURCES[key].name,
            baseUrl: SOURCES[key].baseUrl
        }))
    });
});

// 🔥 Route de test
router.get('/scrape/test', (req, res) => {
    res.json({
        message: '🚀 API de scraping fonctionne!',
        endpoints: {
            scrape: '/api/scrape?id=27205&type=movie&lang=fr&source=multiembed',
            scrapeAll: '/api/scrape/all?id=27205&type=movie',
            sources: '/api/sources'
        }
    });
});

module.exports = router;