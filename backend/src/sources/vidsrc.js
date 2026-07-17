// backend/src/sources/vidsrc.js
const axios = require('axios');
const cheerio = require('cheerio');
const { extractM3U8Urls, extractFromScripts, log } = require('../utils/helpers');

const VIDSRC_BASE = 'https://vidsrc.cc';

const scrapeVidSrc = async (id, type, season, episode, lang = 'fr') => {
    log(`Scraping VidSrc pour ${type} ${id}...`, 'debug');
    
    try {
        // Construction de l'URL
        let url = `${VIDSRC_BASE}/v2/embed/${type}/${id}`;
        if (type === 'tv') {
            url += `/${season}/${episode}`;
        }
        if (lang) {
            url += `?lang=${lang}`;
        }
        
        log(`URL: ${url}`, 'debug');
        
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': VIDSRC_BASE
            }
        });
        
        const $ = cheerio.load(response.data);
        let m3u8Urls = [];
        
        // Chercher dans les scripts
        const scriptUrls = extractFromScripts($);
        m3u8Urls.push(...scriptUrls);
        
        // Chercher dans les sources vidéo
        $('video source, video').each((index, element) => {
            const src = $(element).attr('src') || $(element).attr('data-src');
            if (src && src.includes('.m3u8')) {
                m3u8Urls.push(src);
            }
        });
        
        // Chercher dans les attributs
        $('[data-hls], [data-m3u8]').each((index, element) => {
            const src = $(element).attr('data-hls') || $(element).attr('data-m3u8');
            if (src) {
                m3u8Urls.push(src);
            }
        });
        
        m3u8Urls = [...new Set(m3u8Urls)];
        
        if (m3u8Urls.length > 0) {
            log(`✅ ${m3u8Urls.length} flux trouvés sur VidSrc`, 'success');
            return m3u8Urls[0];
        }
        
        log('❌ Aucun flux trouvé sur VidSrc', 'warning');
        return null;
        
    } catch (error) {
        log(`Erreur VidSrc: ${error.message}`, 'error');
        return null;
    }
};

module.exports = scrapeVidSrc;