// components/singlePage/StreamingSection.jsx - Version avec sources fonctionnelles
"use client";
import { useMemo, useState } from "react";
import SeasonEpisodeSelector from "./SeasonEpisodeSelector";
import LanguageSelector from "./LanguageSelector";

const StreamingSection = ({ 
    imdbId, 
    tmdbId, 
    isSeries = false,
    seasons = [],
    title = "Lecteur vidéo",
    defaultLanguage = "fr"
}) => {
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    const [language, setLanguage] = useState(defaultLanguage);
    const [source, setSource] = useState("multiembed");

    // 🔥 Sources qui fonctionnent réellement
    const sources = {
        multiembed: {
            name: "MultiEmbed",
            url: (id, type, s, e, lang) => {
                let base = `https://multiembed.mov/?video_id=${id}&tmdb=1`;
                if (type === 'series') base += `&s=${s}&e=${e}`;
                if (lang) base += `&lang=${lang}`;
                return base;
            }
        },
        superembed: {
            name: "SuperEmbed",
            url: (id, type, s, e, lang) => {
                let base = `https://superembed.stream/tmdb/${id}`;
                if (type === 'series') base += `?s=${s}&e=${e}`;
                if (lang) base += `&lang=${lang}`;
                return base;
            }
        },
        ive: {
            name: "IVE Embed",
            url: (id, type, s, e, lang) => {
                let base = `https://www.2embed.cc/embed/${type}/${id}`;
                if (type === 'series') base += `/${s}/${e}`;
                if (lang) base += `?lang=${lang}`;
                return base;
            }
        },
        vidsrcpro: {
            name: "VidSrc Pro",
            url: (id, type, s, e, lang) => {
                let base = `https://vidsrc.pro/embed/${type}/${id}`;
                if (type === 'series') base += `/${s}/${e}`;
                if (lang) base += `?lang=${lang}`;
                return base;
            }
        }
    };

    const activeUrl = useMemo(() => {
        const sourceConfig = sources[source];
        if (!sourceConfig) return null;
        
        const id = tmdbId || imdbId;
        if (!id) return null;
        
        const type = isSeries ? 'tv' : 'movie';
        const s = isSeries ? season : null;
        const e = isSeries ? episode : null;
        
        return sourceConfig.url(id, type, s, e, language);
    }, [source, isSeries, imdbId, tmdbId, season, episode, language]);

    if (!activeUrl) {
        return (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-gray-900 text-center text-white">
                <p>Lecteur vidéo indisponible pour cet élément.</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* Lecteur vidéo */}
            <div className="w-full aspect-video overflow-hidden rounded-xl border border-gray-700/50 bg-black shadow-2xl">
                <iframe
                    src={activeUrl}
                    className="h-full w-full border-none"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                    onError={() => console.error("❌ Erreur de chargement de l'iframe")}
                />
            </div>

            {/* Contrôles */}
            <div className="flex flex-wrap gap-3 items-start">
                {/* Sélecteur de source */}
                <div className="w-full sm:w-auto">
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 
                                   rounded-lg border border-gray-700/50 
                                   text-white text-sm font-medium
                                   transition-all duration-200
                                   hover:border-gray-600
                                   min-w-[140px]"
                    >
                        {Object.entries(sources).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sélecteur de langue */}
                <div className="w-full sm:w-auto">
                    <LanguageSelector
                        currentLanguage={language}
                        onLanguageChange={setLanguage}
                    />
                </div>

                {/* Sélecteurs de saison et épisode */}
                {isSeries && seasons.length > 0 && (
                    <div className="flex-1 min-w-[200px]">
                        <SeasonEpisodeSelector
                            seasons={seasons}
                            tmdbId={tmdbId}
                            imdbId={imdbId}
                            currentSeason={season}
                            currentEpisode={episode}
                            onSeasonChange={setSeason}
                            onEpisodeChange={setEpisode}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StreamingSection;