// services/StreamService.js

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

/**
 * Récupère un flux vidéo depuis Torrentio (gratuit)
 */
export const getStreamFromTorrentio = async (tmdbId, type = 'movie') => {
    try {
        // 1. Récupérer l'ID IMDB depuis TMDB
        const tmdbRes = await fetch(
            `https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`
        );
        const tmdbData = await tmdbRes.json();
        const imdbId = tmdbData.external_ids?.imdb_id || tmdbData.imdb_id;

        if (!imdbId) {
            console.log('❌ Aucun ID IMDB trouvé');
            return null;
        }

        console.log(`🎬 IMDB ID: ${imdbId}`);

        // 2. Interroger Torrentio (gratuit)
        const torrentioRes = await fetch(`https://strem.fun/${type}/${imdbId}.json`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!torrentioRes.ok) {
            console.log('❌ Torrentio ne répond pas');
            return null;
        }

        const torrentioData = await torrentioRes.json();

        if (!torrentioData.streams || torrentioData.streams.length === 0) {
            console.log('❌ Aucun flux trouvé sur Torrentio');
            return null;
        }

        // 3. Filtrer pour trouver du français en priorité
        const frenchStreams = torrentioData.streams.filter((stream) => {
            const titleLower = stream.title?.toLowerCase() || '';
            return titleLower.includes('multi') || 
                   titleLower.includes('french') || 
                   titleLower.includes('vf') ||
                   titleLower.includes('français');
        });

        const selectedStream = frenchStreams.length > 0 ? frenchStreams[0] : torrentioData.streams[0];

        console.log(`✅ Flux trouvé: ${selectedStream.title}`);

        return {
            url: selectedStream.url || selectedStream.infoHash,
            title: selectedStream.title,
            name: selectedStream.name,
            quality: selectedStream.quality || 'HD',
            isFrench: frenchStreams.length > 0
        };

    } catch (error) {
        console.error('❌ Erreur StreamService:', error.message);
        return null;
    }
};

/**
 * Récupère les sous-titres français depuis OpenSubtitles (gratuit)
 */
export const getSubtitles = async (imdbId, lang = 'fr') => {
    try {
        // OpenSubtitles API (gratuit avec inscription)
        const response = await fetch(`https://rest.opensubtitles.org/search/imdbid-${imdbId.replace('tt', '')}/sublanguageid-${lang}`, {
            headers: {
                'User-Agent': 'YourAppName v1.0'
            }
        });

        if (!response.ok) return null;

        const data = await response.json();
        
        if (data && data.length > 0) {
            // Prendre le premier sous-titre trouvé
            return {
                url: data[0].SubDownloadLink,
                language: data[0].LanguageName,
                format: data[0].SubFormat
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Erreur sous-titres:', error.message);
        return null;
    }
};

/**
 * URLs de secours (iframes)
 */
export const getBackupUrls = (tmdbId, type = 'movie') => {
    const baseUrl = process.env.NEXT_PUBLIC_FREMBED_URL || 'https://frembed.live';
    const vidsrcUrl = process.env.NEXT_PUBLIC_VIDSRC_URL || 'https://vidsrc.xyz';
    
    return [
        {
            name: 'FrEmbed (VF)',
            url: type === 'movie' 
                ? `${baseUrl}/movie/${tmdbId}`
                : `${baseUrl}/tv/${tmdbId}`,
            lang: 'VF'
        },
        {
            name: 'VidSrc (VO/VF)',
            url: type === 'movie'
                ? `${vidsrcUrl}/movie/${tmdbId}`
                : `${vidsrcUrl}/tv/${tmdbId}`,
            lang: 'VO/VF'
        },
        {
            name: 'MultiEmbed',
            url: `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1${type === 'tv' ? '&s=1&e=1' : ''}&lang=fr`,
            lang: 'VF'
        }
    ];
};