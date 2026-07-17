// backend/router/scraperRoutes.js
const express = require('express');
const router = express.Router();
const { 
    scrapeVideo, 
    scrapeAllSources, 
    getAvailableSources,
    getAudioTracks,
    SCRAPER_APIS,
    LANG_MAPPING
} = require('../services/scraperService');

// ... routes existantes ...

// 🔥 Route pour récupérer les pistes audio disponibles
router.get('/audio-tracks', async (req, res) => {
    const { id, type = 'movie', season = 1, episode = 1 } = req.query;

    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID requis' 
        });
    }

    try {
        const result = await getAudioTracks(id, type, season, episode);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 🔥 Route pour lister les langues disponibles
router.get('/languages', (req, res) => {
    const languages = Object.entries(LANG_MAPPING).map(([code, label]) => ({
        code: code,
        label: label,
        flag: {
            'fr': '🇫🇷',
            'en': '🇬🇧',
            'es': '🇪🇸',
            'de': '🇩🇪',
            'it': '🇮🇹',
            'pt': '🇵🇹',
            'ja': '🇯🇵',
            'ko': '🇰🇷',
            'ru': '🇷🇺',
            'ar': '🇸🇦',
            'hi': '🇮🇳',
            'zh': '🇨🇳'
        }[code] || '🌐'
    }));
    
    res.json({
        success: true,
        languages: languages,
        count: languages.length
    });
});

// 🔥 Route de scraping intelligent avec fallback linguistique
router.get('/smart', async (req, res) => {
    const { id, type = 'movie', season = 1, episode = 1, lang = 'fr' } = req.query;

    if (!id) {
        return res.status(400).json({ 
            success: false, 
            error: 'ID requis (tmdbId ou imdbId)' 
        });
    }

    console.log(`🧠 Scraping intelligent pour ${type} ${id} en ${lang}...`);

    try {
        // Essayer d'abord la langue demandée
        const sources = ['multiembed', 'vidsrc', 'superembed', 'embed2', 'vidsrcpro'];
        let result = null;
        let triedSources = [];

        // Essayer avec la langue demandée
        for (const source of sources) {
            triedSources.push(source);
            console.log(`📡 Tentative avec ${source} en ${lang}...`);
            
            result = await scrapeVideo({
                id,
                type,
                season: parseInt(season),
                episode: parseInt(episode),
                lang,
                source
            });

            if (result.success) {
                console.log(`✅ ${source} a trouvé un flux en ${lang}!`);
                break;
            }
        }

        // Si pas trouvé en français, essayer en anglais
        if (!result?.success && lang !== 'en') {
            console.log(`🔄 Aucun flux en ${lang}, tentative en anglais...`);
            
            for (const source of sources) {
                if (triedSources.includes(source)) continue;
                triedSources.push(source);
                
                result = await scrapeVideo({
                    id,
                    type,
                    season: parseInt(season),
                    episode: parseInt(episode),
                    lang: 'en',
                    source
                });

                if (result.success) {
                    console.log(`✅ ${source} a trouvé un flux en anglais!`);
                    result = {
                        ...result,
                        originalLanguage: lang,
                        fallbackLanguage: 'en',
                        message: `Flux trouvé en anglais (${lang} non disponible)`
                    };
                    break;
                }
            }
        }

        if (result && result.success) {
            res.json({
                ...result,
                smartMode: true,
                triedSources: triedSources,
                originalLanguage: lang
            });
        } else {
            res.json({
                success: false,
                error: 'Aucune source n\'a trouvé de flux',
                triedSources: triedSources,
                language: lang
            });
        }
    } catch (error) {
        console.error('❌ Erreur de scraping intelligent:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;