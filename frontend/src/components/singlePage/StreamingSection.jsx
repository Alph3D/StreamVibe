// components/singlePage/StreamingSection.jsx - Version avec sandbox corrigé
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

    // 🔥 URL avec MultiEmbed (le plus fiable)
    const activeUrl = useMemo(() => {
        let baseUrl = "https://multiembed.mov/?video_id=";
        
        if (tmdbId) {
            baseUrl += `${tmdbId}&tmdb=1`;
        } else if (imdbId) {
            baseUrl += `${imdbId}`;
        } else {
            return null;
        }

        if (isSeries) {
            baseUrl += `&s=${season}&e=${episode}`;
        }

        if (language) {
            baseUrl += `&lang=${language}`;
        }

        return baseUrl;
    }, [isSeries, imdbId, tmdbId, season, episode, language]);

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
                    // 🔥 SUPPRIMÉ : sandbox pour éviter l'erreur
                    // sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
                    onError={() => console.error("❌ Erreur de chargement de l'iframe")}
                />
            </div>

            {/* Contrôles */}
            <div className="flex flex-wrap gap-3 items-start">
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