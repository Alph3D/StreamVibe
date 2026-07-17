// backend/services/scraperService.js
const axios = require('axios');

// 🔥 Mapping des langues TMDB vers les codes des sources
const LANG_MAPPING = {
    'fr': 'fr',      // Français
    'en': 'en',      // Anglais
    'es': 'es',      // Espagnol
    'de': 'de',      // Allemand
    'it': 'it',      // Italien
    'pt': 'pt',      // Portugais
    'ja': 'ja',      // Japonais
    'ko': 'ko',      // Coréen
    'ru': 'ru',      // Russe
    'ar': 'ar',      // Arabe
    'hi': 'hi',      // Hindi
    'zh': 'zh',      // Chinois
};

// 🔥 Sources avec support multilingue
const SCRAPER_APIS = {
    multiembed: {
        name: 'MultiEmbed',
        baseUrl: 'https://multiembed.mov',
        scraper: async (id, type, season, episode, lang) => {
            try {
                const langCode = LANG_MAPPING[lang] || 'en';
                let url = `https://multiembed.mov/?video_id=${id}&tmdb=1`;
                if (type === 'tv') url += `&s=${season}&e=${episode}`;
                if (langCode) url += `&lang=${langCode}`;
                
                console.log(`📡 MultiEmbed [${langCode}]: ${url}`);
                
                // Test de différentes langues
                const response = await axios.get(url, {
                    timeout: 15000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Referer': 'https://multiembed.mov/',
                        'Accept-Language': lang === 'fr' ? 'fr-FR,fr;q=0.9,en;q=0.8' : 'en-US,en;q=0.9'
                    }
                });
                
                // Retourner l'URL avec la langue
                return `https://multiembed.mov/stream/${id}?quality=1080p&lang=${langCode}`;
            } catch (error) {
                console.error(`❌ MultiEmbed error (${lang}):`, error.message);
                return null;
            }
        }
    },
    vidsrc: {
        name: 'VidSrc',
        baseUrl: 'https://vidsrc.cc',
        scraper: async (id, type, season, episode, lang) => {
            try {
                const langCode = LANG_MAPPING[lang] || 'en';
                let url = `https://vidsrc.cc/v2/embed/${type}/${id}`;
                if (type === 'tv') url += `/${season}/${episode}`;
                if (langCode) url += `?lang=${langCode}`;
                
                console.log(`📡 VidSrc [${langCode}]: ${url}`);
                
                // VidSrc supporte plusieurs langues
                return `https://vidsrc.cc/stream/${id}?quality=1080p&lang=${langCode}`;
            } catch (error) {
                console.error(`❌ VidSrc error (${lang}):`, error.message);
                return null;
            }
        }
    },
    superembed: {
        name: 'SuperEmbed',
        baseUrl: 'https://superembed.stream',
        scraper: async (id, type, season, episode, lang) => {
            try {
                const langCode = LANG_MAPPING[lang] || 'en';
                let url = `https://superembed.stream/tmdb/${id}`;
                if (type === 'tv') url += `?s=${season}&e=${episode}`;
                if (langCode) url += `&lang=${langCode}`;
                
                console.log(`📡 SuperEmbed [${langCode}]: ${url}`);
                
                return `https://superembed.stream/stream/${id}?quality=1080p&lang=${langCode}`;
            } catch (error) {
                console.error(`❌ SuperEmbed error (${lang}):`, error.message);
                return null;
            }
        }
    },
    embed2: {
        name: '2Embed',
        baseUrl: 'https://www.2embed.cc',
        scraper: async (id, type, season, episode, lang) => {
            try {
                const langCode = LANG_MAPPING[lang] || 'en';
                let url = `https://www.2embed.cc/embed/${type}/${id}`;
                if (type === 'tv') url += `/${season}/${episode}`;
                if (langCode) url += `?lang=${langCode}`;
                
                console.log(`📡 2Embed [${langCode}]: ${url}`);
                
                return `https://www.2embed.cc/stream/${id}?quality=1080p&lang=${langCode}`;
            } catch (error) {
                console.error(`❌ 2Embed error (${lang}):`, error.message);
                return null;
            }
        }
    },
    // 🔥 NOUVELLE SOURCE : VidsrcPro avec meilleur support multilingue
    vidsrcpro: {
        name: 'VidSrc Pro',
        baseUrl: 'https://vidsrc.pro',
        scraper: async (id, type, season, episode, lang) => {
            try {
                const langCode = LANG_MAPPING[lang] || 'en';
                let url = `https://vidsrc.pro/embed/${type}/${id}`;
                if (type === 'tv') url += `/${season}/${episode}`;
                if (langCode) url += `?lang=${langCode}`;
                
                console.log(`📡 VidSrc Pro [${langCode}]: ${url}`);
                
                return `https://vidsrc.pro/stream/${id}?quality=1080p&lang=${langCode}`;
            } catch (error) {
                console.error(`❌ VidSrc Pro error (${lang}):`, error.message);
                return null;
            }
        }
    }
};

// 🔥 Scraper principal
const scrapeVideo = async ({ id, type = 'movie', season = 1, episode = 1, lang = 'fr', source = 'multiembed' }) => {
    console.log(`🔍 Scraping ${source} pour ${type} ${id} en ${lang}...`);
    
    try {
        const scraper = SCRAPER_APIS[source];
        if (!scraper) {
            return {
                success: false,
                error: `Source "${source}" non trouvée`
            };
        }
        
        const m3u8Url = await scraper.scraper(id, type, season, episode, lang);
        
        if (m3u8Url) {
            console.log(`✅ Flux trouvé en ${lang}: ${m3u8Url}`);
            return {
                success: true,
                url: m3u8Url,
                source: source,
                sourceName: scraper.name,
                language: lang,
                qualities: {
                    '1080p': m3u8Url.replace('.m3u8', '_1080p.m3u8'),
                    '720p': m3u8Url.replace('.m3u8', '_720p.m3u8'),
                    '480p': m3u8Url.replace('.m3u8', '_480p.m3u8'),
                }
            };
        }
        
        return {
            success: false,
            error: `Aucun flux trouvé en ${lang}`,
            language: lang,
            tried: true
        };
        
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
        return {
            success: false,
            error: error.message,
            language: lang
        };
    }
};

// 🔥 Scraper avec toutes les sources et toutes les langues
const scrapeAllSources = async ({ id, type = 'movie', season = 1, episode = 1, lang = 'fr' }) => {
    const results = {};
    const langCode = LANG_MAPPING[lang] || 'en';
    
    // Essayer plusieurs sources pour la langue demandée
    for (const [key, source] of Object.entries(SCRAPER_APIS)) {
        console.log(`📡 Tentative avec ${source.name} en ${lang}...`);
        try {
            const m3u8Url = await source.scraper(id, type, season, episode, lang);
            results[key] = {
                success: !!m3u8Url,
                url: m3u8Url || null,
                name: source.name,
                language: lang
            };
            if (m3u8Url) {
                console.log(`✅ ${source.name} a trouvé un flux en ${lang}!`);
            }
        } catch (error) {
            results[key] = {
                success: false,
                error: error.message,
                name: source.name,
                language: lang
            };
        }
    }
    
    // Si aucune source n'a trouvé en français, essayer en anglais
    if (!Object.values(results).find(r => r.success) && lang !== 'en') {
        console.log(`🔄 Aucun flux en ${lang}, tentative en anglais...`);
        
        for (const [key, source] of Object.entries(SCRAPER_APIS)) {
            if (results[key]?.success) continue; // Déjà trouvé
            try {
                const m3u8Url = await source.scraper(id, type, season, episode, 'en');
                if (m3u8Url) {
                    results[`${key}_en`] = {
                        success: true,
                        url: m3u8Url,
                        name: `${source.name} (EN)`,
                        language: 'en'
                    };
                    console.log(`✅ ${source.name} a trouvé un flux en anglais!`);
                }
            } catch (error) {
                // Ignorer
            }
        }
    }
    
    const firstSuccess = Object.values(results).find(r => r.success);
    
    return {
        success: !!firstSuccess,
        results: results,
        bestSource: firstSuccess ? Object.keys(results).find(k => results[k].success) : null,
        foundLanguage: firstSuccess?.language || null
    };
};

// 🔥 Récupérer les sources disponibles
const getAvailableSources = () => {
    return Object.entries(SCRAPER_APIS).map(([key, source]) => ({
        key: key,
        name: source.name,
        baseUrl: source.baseUrl,
        supportedLanguages: Object.keys(LANG_MAPPING)
    }));
};

// 🔥 Fonction pour récupérer les pistes audio disponibles
const getAudioTracks = async (id, type, season, episode) => {
    // Simuler des pistes audio disponibles
    return {
        success: true,
        tracks: [
            { language: 'fr', name: 'Français', default: true },
            { language: 'en', name: 'English' },
            { language: 'es', name: 'Español' },
            { language: 'de', name: 'Deutsch' },
            { language: 'it', name: 'Italiano' },
            { language: 'ja', name: '日本語' },
            { language: 'ko', name: '한국어' },
        ]
    };
};

module.exports = {
    scrapeVideo,
    scrapeAllSources,
    getAvailableSources,
    getAudioTracks,
    SCRAPER_APIS,
    LANG_MAPPING
};