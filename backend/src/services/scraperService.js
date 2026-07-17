// backend/src/services/scraperService.js
const axios = require('axios');
const cheerio = require('cheerio');
const { extractM3U8Urls, extractFromScripts, log } = require('../utils/scraperHelpers');

// 🔥 Configuration des sources
const SOURCES = {
    multiembed: {
        name: 'MultiEmbed',
        baseUrl: 'https://multiembed.mov',
        scraper: async (id, type, season, episode, lang) => {
            let url = `https://multiembed.mov/?video_id=${id}&tmdb=1`;
            if (type === 'tv') url += `&s=${season}&e=${episode}`;
            if (lang) url += `&lang=${lang}`;
            
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://multiembed.mov/'
                }
            });
            
            const $ = cheerio.load(response.data);
            let m3u8Urls = [];
            
            // Chercher dans les scripts
            const scriptUrls = extractFromScripts($);
            m3u8Urls.push(...scriptUrls);
            
            // Chercher dans les iframes
            const iframes = $('iframe');
            for (const iframe of iframes) {
                const src = $(iframe).attr('src');
                if (src && src.includes('.m3u8')) {
                    m3u8Urls.push(src);
                }
            }
            
            // Chercher dans le texte
            const textMatches = extractM3U8Urls($('body').text());
            m3u8Urls.push(...textMatches);
            
            m3u8Urls = [...new Set(m3u8Urls)];
            return m3u8Urls.length > 0 ? m3u8Urls[0] : null;
        }
    },
    vidsrc: {
        name: 'VidSrc',
        baseUrl: 'https://vidsrc.cc',
        scraper: async (id, type, season, episode, lang) => {
            let url = `https://vidsrc.cc/v2/embed/${type}/${id}`;
            if (type === 'tv') url += `/${season}/${episode}`;
            if (lang) url += `?lang=${lang}`;
            
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://vidsrc.cc/'
                }
            });
            
            const $ = cheerio.load(response.data);
            let m3u8Urls = [];
            
            const scriptUrls = extractFromScripts($);
            m3u8Urls.push(...scriptUrls);
            
            // Chercher dans les sources vidéo
            $('video source, video').each((index, element) => {
                const src = $(element).attr('src') || $(element).attr('data-src');
                if (src && src.includes('.m3u8')) {
                    m3u8Urls.push(src);
                }
            });
            
            m3u8Urls = [...new Set(m3u8Urls)];
            return m3u8Urls.length > 0 ? m3u8Urls[0] : null;
        }
    },
    superembed: {
        name: 'SuperEmbed',
        baseUrl: 'https://superembed.stream',
        scraper: async (id, type, season, episode, lang) => {
            let url = `https://superembed.stream/tmdb/${id}`;
            if (type === 'tv') url += `?s=${season}&e=${episode}`;
            if (lang) url += `&lang=${lang}`;
            
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://superembed.stream/'
                }
            });
            
            const $ = cheerio.load(response.data);
            let m3u8Urls = [];
            
            const scriptUrls = extractFromScripts($);
            m3u8Urls.push(...scriptUrls);
            
            // Suivre les iframes
            const iframes = $('iframe');
            for (const iframe of iframes) {
                const src = $(iframe).attr('src');
                if (src) {
                    try {
                        const iframeResponse = await axios.get(src, { timeout: 5000 });
                        const iframe$ = cheerio.load(iframeResponse.data);
                        const iframeUrls = extractFromScripts(iframe$);
                        m3u8Urls.push(...iframeUrls);
                    } catch (e) {}
                }
            }
            
            m3u8Urls = [...new Set(m3u8Urls)];
            return m3u8Urls.length > 0 ? m3u8Urls[0] : null;
        }
    }
};

/**
 * Scraper principal
 */
const scrapeVideo = async ({ id, type = 'movie', season = 1, episode = 1, lang = 'fr', source = 'multiembed' }) => {
    log(`🔍 Scraping ${source} pour ${type} ${id}...`, 'debug');
    
    try {
        const scraper = SOURCES[source];
        if (!scraper) {
            return {
                success: false,
                error: `Source "${source}" non trouvée`
            };
        }
        
        const m3u8Url = await scraper.scraper(id, type, season, episode, lang);
        
        if (m3u8Url) {
            log(`✅ Flux trouvé: ${m3u8Url}`, 'success');
            return {
                success: true,
                url: m3u8Url,
                source: source,
                sourceName: scraper.name,
                qualities: {
                    '1080p': m3u8Url.replace('.m3u8', '_1080p.m3u8'),
                    '720p': m3u8Url.replace('.m3u8', '_720p.m3u8'),
                    '480p': m3u8Url.replace('.m3u8', '_480p.m3u8'),
                }
            };
        }
        
        return {
            success: false,
            error: 'Aucun flux trouvé'
        };
        
    } catch (error) {
        log(`❌ Erreur: ${error.message}`, 'error');
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Scraper avec toutes les sources (fallback)
 */
const scrapeAllSources = async ({ id, type = 'movie', season = 1, episode = 1, lang = 'fr' }) => {
    const results = {};
    
    for (const [key, source] of Object.entries(SOURCES)) {
        log(`📡 Tentative avec ${source.name}...`, 'debug');
        try {
            const m3u8Url = await source.scraper(id, type, season, episode, lang);
            results[key] = {
                success: !!m3u8Url,
                url: m3u8Url || null,
                name: source.name
            };
        } catch (error) {
            results[key] = {
                success: false,
                error: error.message,
                name: source.name
            };
        }
    }
    
    const firstSuccess = Object.values(results).find(r => r.success);
    
    return {
        success: !!firstSuccess,
        results: results,
        bestSource: firstSuccess ? Object.keys(results).find(k => results[k].success) : null
    };
};

module.exports = {
    scrapeVideo,
    scrapeAllSources,
    SOURCES
};