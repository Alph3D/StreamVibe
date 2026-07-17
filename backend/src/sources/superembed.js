// backend/src/sources/superembed.js
const axios = require('axios');
const cheerio = require('cheerio');
const { extractM3U8Urls, extractFromScripts, log } = require('../utils/helpers');

const SUPEREMBED_BASE = 'https://superembed.stream';

const scrapeSuperEmbed = async (id, type, season, episode, lang = 'fr') => {
    log(`Scraping SuperEmbed pour ${type} ${id}...`, 'debug');
    
    try {
        // Construction de l'URL
        let url = `${SUPEREMBED_BASE}/tmdb/${id}`;
        if (type === 'tv') {
            url += `?s=${season}&e=${episode}`;
        }
        if (lang) {
            url += `${type === 'tv' ? '&' : '?'}lang=${lang}`;
        }
        
        log(`URL: ${url}`, 'debug');
        
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': SUPEREMBED_BASE
            }
        });
        
        const $ = cheerio.load(response.data);
        let m3u8Urls = [];
        
        // Chercher dans les scripts
        const scriptUrls = extractFromScripts($);
        m3u8Urls.push(...scriptUrls);
        
        // Chercher les iframes et suivre
        const iframes = $('iframe');
        for (const iframe of iframes) {
            const src = $(iframe).attr('src');
            if (src) {
                try {
                    const iframeResponse = await axios.get(src, {
                        timeout: 5000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    const iframe$ = cheerio.load(iframeResponse.data);
                    const iframeUrls = extractFromScripts(iframe$);
                    m3u8Urls.push(...iframeUrls);
                } catch (e) {
                    // Ignorer
                }
            }
        }
        
        m3u8Urls = [...new Set(m3u8Urls)];
        
        if (m3u8Urls.length > 0) {
            log(`✅ ${m3u8Urls.length} flux trouvés sur SuperEmbed`, 'success');
            return m3u8Urls[0];
        }
        
        log('❌ Aucun flux trouvé sur SuperEmbed', 'warning');
        return null;
        
    } catch (error) {
        log(`Erreur SuperEmbed: ${error.message}`, 'error');
        return null;
    }
};

module.exports = scrapeSuperEmbed;