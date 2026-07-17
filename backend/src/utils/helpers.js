// backend/src/utils/helpers.js

/**
 * Extrait les URLs M3U8 d'un texte
 */
const extractM3U8Urls = (text) => {
    if (!text) return [];
    const regex = /https?:\/\/[^\s"']+\.m3u8[^\s"']*/g;
    return text.match(regex) || [];
};

/**
 * Extrait les URLs d'un script
 */
const extractFromScripts = ($, selector = 'script') => {
    const urls = [];
    $(selector).each((index, element) => {
        const content = $(element).html();
        if (content) {
            const matches = extractM3U8Urls(content);
            urls.push(...matches);
        }
    });
    return urls;
};

/**
 * Extrait les URLs des iframes
 */
const extractFromIframes = async ($, axios) => {
    const urls = [];
    const iframes = $('iframe');
    
    for (const iframe of iframes) {
        const src = $(iframe).attr('src');
        if (src) {
            if (src.includes('.m3u8')) {
                urls.push(src);
            } else {
                // Tester le contenu de l'iframe
                try {
                    const response = await axios.get(src, {
                        timeout: 5000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                        }
                    });
                    const matches = extractM3U8Urls(response.data);
                    urls.push(...matches);
                } catch (e) {
                    // Ignorer les erreurs
                }
            }
        }
    }
    
    return urls;
};

/**
 * Nettoie une URL
 */
const cleanUrl = (url) => {
    if (!url) return null;
    return url.trim().replace(/[^a-zA-Z0-9:\/\.\-_?=&]/g, '');
};

/**
 * Log avec timestamp
 */
const log = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const prefix = {
        info: '📘',
        success: '✅',
        error: '❌',
        warning: '⚠️',
        debug: '🔍'
    }[type] || '📘';
    console.log(`${prefix} [${timestamp}] ${message}`);
};

module.exports = {
    extractM3U8Urls,
    extractFromScripts,
    extractFromIframes,
    cleanUrl,
    log
};