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

    // 🔥 S'assurer que les saisons sont correctement formatées
    const normalizedSeasons = seasons.map(season => ({
        season_number: season.season_number || season.number || season.id || 1,
        episode_count: season.episode_count || season.episodes?.length || 20,
        episodes: season.episodes || []
    }));

    // 🔥 Trouver la saison sélectionnée
    useEffect(() => {
        if (normalizedSeasons.length === 0) {
            // Données par défaut si aucune saison
            const defaultEpisodes = Array.from({ length: 20 }, (_, i) => ({
                episode_number: i + 1,
                title: `Épisode ${i + 1}`,
            }));
            setSeasonEpisodes(defaultEpisodes);
            return;
        }

        const season = normalizedSeasons.find(s => s.season_number === selectedSeason);
        
        if (season) {
            if (season.episodes && season.episodes.length > 0) {
                setSeasonEpisodes(season.episodes);
            } else {
                const count = season.episode_count || 20;
                setSeasonEpisodes(
                    Array.from({ length: count }, (_, i) => ({
                        episode_number: i + 1,
                        title: `Épisode ${i + 1}`,
                    }))
                );
            }
        } else {
            // Si la saison n'existe pas, prendre la première
            const firstSeason = normalizedSeasons[0];
            if (firstSeason) {
                setSelectedSeason(firstSeason.season_number);
                const count = firstSeason.episode_count || 20;
                setSeasonEpisodes(
                    Array.from({ length: count }, (_, i) => ({
                        episode_number: i + 1,
                        title: `Épisode ${i + 1}`,
                    }))
                );
            }
        }
    }, [selectedSeason, normalizedSeasons]);

    // 🔥 Gestion du changement de saison
    const handleSeasonSelect = (seasonNumber) => {
        setSelectedSeason(seasonNumber);
        setSelectedEpisode(1);
        setIsSeasonDropdownOpen(false);
        
        if (onSeasonChange) onSeasonChange(seasonNumber);
        if (onEpisodeChange) onEpisodeChange(1);
    };

    // 🔥 Gestion du changement d'épisode
    const handleEpisodeSelect = (episodeNumber) => {
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

    // 🔥 Si pas de saisons, afficher un message
    if (normalizedSeasons.length === 0) {
        return (
            <div className="season-episode-selector w-full">
                <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[150px] px-4 py-2.5 bg-gray-800/30 rounded-lg border border-gray-700/30 text-gray-500 text-sm text-center">
                        Aucune saison disponible
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="season-episode-selector w-full space-y-3">
            <div className="flex flex-wrap gap-3">
                
                {/* 🔥 Sélecteur de SAISON */}
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
                                {normalizedSeasons.map((season) => (
                                    <button
                                        key={season.season_number}
                                        onClick={() => handleSeasonSelect(season.season_number)}
                                        className={`w-full px-3 py-2.5 text-left text-sm rounded-lg
                                                  transition-all duration-150
                                                  ${selectedSeason === season.season_number
                                                      ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                                                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                                  }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">
                                                Saison {season.season_number}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {season.episode_count} épisodes
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 🔥 Sélecteur de ÉPISODE */}
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
                    Saison {selectedSeason} • Épisode {selectedEpisode}
                    {seasonEpisodes.find(e => e.episode_number === selectedEpisode)?.title && 
                        ` — ${seasonEpisodes.find(e => e.episode_number === selectedEpisode)?.title}`
                    }
                </span>
            </div>
        </div>
    );
};

export default SeasonEpisodeSelector;