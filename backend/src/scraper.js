// backend/src/scraper.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const scrapeMultiEmbed = require('./sources/multiembed');
const scrapeVidSrc = require('./sources/vidsrc');
const scrapeSuperEmbed = require('./sources/superembed');
const { log } = require('./utils/helpers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 Configuration des sources
const SOURCES = {
    multiembed: {
        name: 'MultiEmbed',
        scraper: scrapeMultiEmbed
    },
    vidsrc: {
        name: 'VidSrc',
        scraper: scrapeVidSrc
    },
    superembed: {
        name: 'SuperEmbed',
        scraper: scrapeSuperEmbed
    }
};

// 🔥 Route principale de scraping
app.get('/api/scrape', async (req, res) => {
    const { 
        id, 
        type = 'movie', 
        season = 1, 
        episode = 1, 
        lang = 'fr', 
        source = 'multiembed' 
    } = req.query;

    // Validation
    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID requis (tmdbId ou imdbId)' 
        });
    }

    const scraper = SOURCES[source];
    if (!scraper) {
        return res.status(400).json({ 
            success: false, 
            error: `Source "${source}" non trouvée. Sources disponibles: ${Object.keys(SOURCES).join(', ')}` 
        });
    }

    log(`🔍 Scraping ${source} pour ${type} ${id} (S${season}E${episode})...`, 'info');

    try {
        const m3u8Url = await scraper.scraper(id, type, parseInt(season), parseInt(episode), lang);

        if (m3u8Url) {
            log(`✅ Flux trouvé: ${m3u8Url}`, 'success');
            
            // Générer les URLs des différentes qualités
            const qualities = {
                '1080p': m3u8Url.replace('.m3u8', '_1080p.m3u8'),
                '720p': m3u8Url.replace('.m3u8', '_720p.m3u8'),
                '480p': m3u8Url.replace('.m3u8', '_480p.m3u8'),
            };

            res.json({
                success: true,
                url: m3u8Url,
                source: source,
                sourceName: scraper.name,
                qualities: qualities,
                type: type,
                id: id,
                season: season,
                episode: episode,
                lang: lang
            });
        } else {
            log(`❌ Aucun flux trouvé pour ${source}`, 'warning');
            res.json({
                success: false,
                error: 'Aucun flux vidéo trouvé',
                source: source,
                tried: true
            });
        }
    } catch (error) {
        log(`❌ Erreur: ${error.message}`, 'error');
        res.status(500).json({
            success: false,
            error: error.message,
            source: source
        });
    }
});

// 🔥 Route pour scraper avec toutes les sources (fallback)
app.get('/api/scrape/all', async (req, res) => {
    const { id, type = 'movie', season = 1, episode = 1, lang = 'fr' } = req.query;

    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID requis' 
        });
    }

    log(`🔍 Scraping toutes les sources pour ${type} ${id}...`, 'info');

    const results = {};
    
    for (const [key, source] of Object.entries(SOURCES)) {
        log(`📡 Tentative avec ${source.name}...`, 'debug');
        try {
            const m3u8Url = await source.scraper(id, type, parseInt(season), parseInt(episode), lang);
            results[key] = {
                success: !!m3u8Url,
                url: m3u8Url || null,
                name: source.name
            };
            if (m3u8Url) {
                log(`✅ ${source.name} a trouvé un flux!`, 'success');
            }
        } catch (error) {
            results[key] = {
                success: false,
                error: error.message,
                name: source.name
            };
        }
    }

    // Trouver le premier succès
    const firstSuccess = Object.values(results).find(r => r.success);
    
    res.json({
        success: !!firstSuccess,
        results: results,
        bestSource: firstSuccess ? Object.keys(results).find(k => results[k].success) : null
    });
});

// 🔥 Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        sources: Object.keys(SOURCES),
        version: '1.0.0'
    });
});

// 🔥 Route de test
app.get('/api/test', (req, res) => {
    res.json({
        message: '🚀 Serveur de scraping fonctionne!',
        endpoints: {
            scrape: '/api/scrape?id=ID&type=movie&lang=fr&source=multiembed',
            scrapeAll: '/api/scrape/all?id=ID&type=movie',
            health: '/api/health'
        },
        example: '/api/scrape?id=27205&type=movie&lang=fr'
    });
});

// 🔥 Démarrer le serveur
app.listen(PORT, () => {
    console.log(`\n🚀 Serveur de scraping démarré sur http://localhost:${PORT}`);
    console.log(`📡 Sources disponibles: ${Object.keys(SOURCES).join(', ')}`);
    console.log(`📝 Exemple: http://localhost:${PORT}/api/scrape?id=27205&type=movie&lang=fr\n`);
});