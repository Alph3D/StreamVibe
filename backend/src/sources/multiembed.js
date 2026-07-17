// backend/src/sources/multiembed.js
const axios = require('axios');
const cheerio = require('cheerio');
const { extractM3U8Urls, extractFromScripts, extractFromIframes, log } = require('../utils/helpers');

const MULTIEMBED_BASE = 'https://multiembed.mov';

const scrapeMultiEmbed = async (id, type, season, episode, lang = 'fr') => {
    log(`Scraping MultiEmbed pour ${type} ${id}...`, 'debug');
    
    try {
        // Construction de l'URL
        let url = `${MULTIEMBED_BASE}/?video_id=${id}&tmdb=1`;
        if (type === 'tv') {
            url += `&s=${season}&e=${episode}`;
        }
        if (lang) {
            url += `&lang=${lang}`;
        }
        
        log(`URL: ${url}`, 'debug');
        
        // Récupération de la page
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': MULTIEMBED_BASE,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            }
        });
        
        const $ = cheerio.load(response.data);
        let m3u8Urls = [];
        
        // 1. Chercher dans les scripts
        const scriptUrls = extractFromScripts($);
        m3u8Urls.push(...scriptUrls);
        
        // 2. Chercher dans les iframes
        const iframeUrls = await extractFromIframes($, axios);
        m3u8Urls.push(...iframeUrls);
        
        // 3. Chercher dans les attributs data
        $('[data-src], [data-url], [data-href]').each((index, element) => {
            const src = $(element).attr('data-src') || $(element).attr('data-url') || $(element).attr('data-href');
            if (src && src.includes('.m3u8')) {
                m3u8Urls.push(src);
            }
        });
        
        // 4. Chercher dans le texte de la page
        const pageText = $('body').text();
        const textMatches = extractM3U8Urls(pageText);
        m3u8Urls.push(...textMatches);
        
        // Filtrer les URLs uniques
        m3u8Urls = [...new Set(m3u8Urls)];
        
        if (m3u8Urls.length > 0) {
            log(`✅ ${m3u8Urls.length} flux trouvés sur MultiEmbed`, 'success');
            return m3u8Urls[0]; // Retourner le premier flux trouvé
        }
        
        log('❌ Aucun flux trouvé sur MultiEmbed', 'warning');
        return null;
        
    } catch (error) {
        log(`Erreur MultiEmbed: ${error.message}`, 'error');
        return null;
    }
};

module.exports = scrapeMultiEmbed;