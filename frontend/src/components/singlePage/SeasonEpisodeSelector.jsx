// components/singlePage/SeasonEpisodeSelector.jsx
"use client";

import { useState, useEffect } from "react";

const SeasonEpisodeSelector = ({ 
    seasons = [], 
    tmdbId, 
    imdbId,
    onSeasonChange,
    onEpisodeChange,
    currentSeason = 1,
    currentEpisode = 1
}) => {
    const [selectedSeason, setSelectedSeason] = useState(currentSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(currentEpisode);
    const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);
    const [isEpisodeDropdownOpen, setIsEpisodeDropdownOpen] = useState(false);
    const [seasonEpisodes, setSeasonEpisodes] = useState([]);

    console.log("📊 Seasons reçues:", seasons);
    console.log("📊 Nombre de saisons:", seasons?.length);

    // Trouver la saison sélectionnée et ses épisodes
    useEffect(() => {
        if (!seasons || seasons.length === 0) {
            // Si pas de saisons, générer des données par défaut
            const defaultSeasons = [
                { season_number: 1, episode_count: 20 },
                { season_number: 2, episode_count: 20 },
                { season_number: 3, episode_count: 20 },
            ];
            const season = defaultSeasons.find(s => s.season_number === selectedSeason);
            if (season) {
                setSeasonEpisodes(
                    Array.from({ length: season.episode_count || 20 }, (_, i) => ({
                        episode_number: i + 1,
                        title: `Épisode ${i + 1}`,
                    }))
                );
            }
            return;
        }

        // Trouver la saison dans les données
        const season = seasons.find(s => {
            const seasonNum = s.season_number || s.number || s.id;
            return seasonNum === selectedSeason;
        });
        
        console.log("📊 Saison trouvée:", season);
        
        if (season) {
            // Si la saison a des épisodes
            if (season.episodes && season.episodes.length > 0) {
                console.log("📊 Épisodes trouvés:", season.episodes);
                setSeasonEpisodes(season.episodes);
            } else {
                // Sinon, générer avec le nombre d'épisodes
                const episodeCount = season.episode_count || season.episodeCount || 20;
                console.log(`📊 Génération de ${episodeCount} épisodes par défaut`);
                setSeasonEpisodes(
                    Array.from({ length: episodeCount }, (_, i) => ({
                        episode_number: i + 1,
                        title: `Épisode ${i + 1}`,
                    }))
                );
            }
        } else {
            // Si la saison n'est pas trouvée, utiliser la première saison
            const firstSeason = seasons[0];
            if (firstSeason) {
                const seasonNum = firstSeason.season_number || firstSeason.number || 1;
                setSelectedSeason(seasonNum);
                const episodeCount = firstSeason.episode_count || firstSeason.episodeCount || 20;
                setSeasonEpisodes(
                    Array.from({ length: episodeCount }, (_, i) => ({
                        episode_number: i + 1,
                        title: `Épisode ${i + 1}`,
                    }))
                );
            }
        }
    }, [selectedSeason, seasons]);

    // Gestion du changement de saison
    const handleSeasonSelect = (seasonNumber) => {
        console.log(`📺 Changement de saison: ${seasonNumber}`);
        setSelectedSeason(seasonNumber);
        setSelectedEpisode(1);
        setIsSeasonDropdownOpen(false);
        
        if (onSeasonChange) onSeasonChange(seasonNumber);
        if (onEpisodeChange) onEpisodeChange(1);
    };

    // Gestion du changement d'épisode
    const handleEpisodeSelect = (episodeNumber) => {
        console.log(`📺 Changement d'épisode: ${episodeNumber}`);
        setSelectedEpisode(episodeNumber);
        setIsEpisodeDropdownOpen(false);
        
        if (onEpisodeChange) onEpisodeChange(episodeNumber);
    };

    // Fermer les dropdowns au clic en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.season-episode-selector')) {
                setIsSeasonDropdownOpen(false);
                setIsEpisodeDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Trouver le titre de l'épisode sélectionné
    const currentEpisodeTitle = seasonEpisodes.find(
        ep => ep.episode_number === selectedEpisode
    )?.title || `Épisode ${selectedEpisode}`;

    // Récupérer la liste des saisons (avec fallback)
    const seasonsList = seasons && seasons.length > 0 ? seasons : [
        { season_number: 1, episode_count: 20 },
        { season_number: 2, episode_count: 20 },
        { season_number: 3, episode_count: 20 },
    ];

    return (
        <div className="season-episode-selector w-full space-y-3">
            <div className="flex flex-wrap gap-3">
                
                {/* Sélecteur de SAISON */}
                <div className="relative flex-1 min-w-[150px]">
                    <button
                        onClick={() => {
                            setIsSeasonDropdownOpen(!isSeasonDropdownOpen);
                            setIsEpisodeDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 
                                   rounded-lg border border-gray-700/50 
                                   text-white text-sm font-medium
                                   flex items-center justify-between
                                   transition-all duration-200
                                   hover:border-gray-600"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">SAISON</span>
                            <span className="text-white font-bold">{selectedSeason}</span>
                        </span>
                        <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isSeasonDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown des saisons */}
                    {isSeasonDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full 
                                      bg-gray-800/95 backdrop-blur-sm 
                                      border border-gray-700/50 
                                      rounded-lg shadow-2xl
                                      max-h-60 overflow-y-auto
                                      scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            <div className="p-1">
                                {seasonsList.map((season) => {
                                    const seasonNum = season.season_number || season.number || season.id;
                                    const episodeCount = season.episode_count || season.episodeCount || 
                                                       season.episodes?.length || 20;
                                    
                                    return (
                                        <button
                                            key={seasonNum}
                                            onClick={() => handleSeasonSelect(seasonNum)}
                                            className={`w-full px-3 py-2.5 text-left text-sm rounded-lg
                                                      transition-all duration-150
                                                      ${selectedSeason === seasonNum
                                                          ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                                      }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">
                                                    Saison {seasonNum}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {episodeCount} épisodes
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sélecteur de ÉPISODE */}
                <div className="relative flex-1 min-w-[150px]">
                    <button
                        onClick={() => {
                            setIsEpisodeDropdownOpen(!isEpisodeDropdownOpen);
                            setIsSeasonDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 
                                   rounded-lg border border-gray-700/50 
                                   text-white text-sm font-medium
                                   flex items-center justify-between
                                   transition-all duration-200
                                   hover:border-gray-600"
                    >
                        <span className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">ÉPISODE</span>
                            <span className="text-white font-bold">{selectedEpisode}</span>
                        </span>
                        <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isEpisodeDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown des épisodes */}
                    {isEpisodeDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-full 
                                      bg-gray-800/95 backdrop-blur-sm 
                                      border border-gray-700/50 
                                      rounded-lg shadow-2xl
                                      max-h-60 overflow-y-auto
                                      scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                            <div className="p-1">
                                {seasonEpisodes.length > 0 ? (
                                    seasonEpisodes.map((ep) => {
                                        const episodeNumber = ep.episode_number || ep.number || ep.id;
                                        const episodeTitle = ep.title || ep.name || `Épisode ${episodeNumber}`;
                                        
                                        return (
                                            <button
                                                key={episodeNumber}
                                                onClick={() => handleEpisodeSelect(episodeNumber)}
                                                className={`w-full px-3 py-2.5 text-left text-sm rounded-lg
                                                          transition-all duration-150
                                                          ${selectedEpisode === episodeNumber
                                                              ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                                              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                                          }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">
                                                        Ép. {episodeNumber}
                                                    </span>
                                                    <span className="text-xs text-gray-500 truncate max-w-[120px]">
                                                        {episodeTitle !== `Épisode ${episodeNumber}` && episodeTitle}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                                        Aucun épisode disponible
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Affichage de l'épisode actuel */}
            <div className="text-xs text-gray-500/70 px-1">
                <span>
                    Saison {selectedSeason} • {currentEpisodeTitle}
                </span>
            </div>

            {/* Debug - Afficher les données reçues */}
            <div className="text-[10px] text-gray-600/50 px-1 mt-2 border-t border-gray-800/50 pt-2">
                <span>Debug: {seasons?.length || 0} saisons reçues</span>
            </div>
        </div>
    );
};

export default SeasonEpisodeSelector;