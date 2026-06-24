// components/SeriesPlayer.jsx
"use client";
import { useState, useEffect } from "react";
import StreamingSection from "./StreamingSection";

const SeriesPlayer = ({ 
    tmdbId, 
    imdbId, 
    seasons = [], 
    seriesTitle = "Série",
    initialSeason = 0,
    initialEpisode = 1
}) => {
    const [selectedSeason, setSelectedSeason] = useState(initialSeason);
    const [selectedEpisode, setSelectedEpisode] = useState(initialEpisode);
    const [currentSeasonData, setCurrentSeasonData] = useState(null);

    // Generate default seasons if none provided
    const seasonsList = seasons.length > 0 ? seasons : [
        { season_number: 0, episode_count: 39 },
        { season_number: 1, episode_count: 61 },
        { season_number: 2, episode_count: 16 },
        { season_number: 3, episode_count: 14 },
        { season_number: 4, episode_count: 39 },
        { season_number: 5, episode_count: 13 },
        { season_number: 6, episode_count: 52 },
        { season_number: 7, episode_count: 33 },
        { season_number: 8, episode_count: 35 },
        { season_number: 9, episode_count: 73 },
        { season_number: 10, episode_count: 45 },
        { season_number: 11, episode_count: 26 },
        { season_number: 12, episode_count: 14 },
        { season_number: 13, episode_count: 101 },
        { season_number: 14, episode_count: 58 },
        { season_number: 15, episode_count: 62 },
        { season_number: 16, episode_count: 50 },
        { season_number: 17, episode_count: 56 },
        { season_number: 18, episode_count: 55 },
        { season_number: 19, episode_count: 74 },
        { season_number: 20, episode_count: 14 },
        { season_number: 21, episode_count: 197 },
        { season_number: 22, episode_count: 67 },
        { season_number: 23, episode_count: 26 },
    ];

    // Update current season data when season changes
    useEffect(() => {
        const season = seasonsList.find(s => s.season_number === selectedSeason);
        setCurrentSeasonData(season);
    }, [selectedSeason, seasonsList]);

    // Reset to episode 1 when season changes
    useEffect(() => {
        setSelectedEpisode(1);
    }, [selectedSeason]);

    const episodeCount = currentSeasonData?.episode_count || 39;

    const handleSeasonChange = (e) => {
        const seasonNumber = parseInt(e.target.value);
        setSelectedSeason(seasonNumber);
        console.log(`📺 Saison ${seasonNumber} sélectionnée`);
    };

    const handleEpisodeClick = (episodeNumber) => {
        setSelectedEpisode(episodeNumber);
        console.log(`📺 Épisode ${episodeNumber} - Saison ${selectedSeason}`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            {/* Titre de la série */}
            <h1 className="text-2xl font-bold text-white mb-4">{seriesTitle}</h1>

            {/* 
              🎯 LAYOUT : Lecteur vidéo (gauche) + Cadre saisons (droite)
              Comme YouTube
            */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* 
                  ⬅️ COLONNE GAUCHE : Lecteur vidéo (comme YouTube)
                  Largeur 70% sur desktop, 100% sur mobile
                */}
                <div className="w-full lg:w-[70%]">
                    <StreamingSection
                        tmdbId={tmdbId}
                        imdbId={imdbId}
                        isSeries={true}
                        selectedSeason={selectedSeason}
                        selectedEpisode={selectedEpisode}
                        onSeasonChange={setSelectedSeason}
                        onEpisodeChange={setSelectedEpisode}
                        title=""
                    />

                    {/* Informations supplémentaires sous le lecteur */}
                    <div className="mt-3 text-white">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">SAISON:</span>
                            <span className="font-bold text-blue-400">{selectedSeason}</span>
                            <span className="text-gray-400 ml-2">ÉPISODE:</span>
                            <span className="font-bold text-red-400">{selectedEpisode}</span>
                        </div>
                    </div>
                </div>

                {/* 
                  ➡️ COLONNE DROITE : Cadre "CHOISIR UNE SAISON" (comme barre latérale YouTube)
                  Largeur 30% sur desktop, 100% sur mobile
                */}
                <div className="w-full lg:w-[30%]">
                    <div className="
                        w-full 
                        rounded-xl 
                        border border-gray-800 
                        bg-gray-900/80 
                        p-3 
                        text-white 
                        shadow-lg
                        flex 
                        flex-col
                        h-[500px] 
                        lg:h-[450px]
                    ">
                        {/* Header & Season Dropdown */}
                        <div className="mb-3 flex-shrink-0">
                            <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-400">
                                Choisir une saison
                            </label>
                            <select
                                value={selectedSeason}
                                onChange={handleSeasonChange}
                                className="
                                    w-full 
                                    rounded 
                                    border border-gray-700 
                                    bg-gray-800 
                                    p-2 
                                    text-sm 
                                    text-white
                                    focus:outline-none 
                                    focus:ring-2 
                                    focus:ring-blue-600
                                    cursor-pointer
                                    appearance-none
                                    bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
                                    bg-[length:12px_12px]
                                    bg-[right_12px_center]
                                    bg-no-repeat
                                    pr-10
                                "
                            >
                                {seasonsList.map((season) => (
                                    <option 
                                        key={season.season_number} 
                                        value={season.season_number}
                                    >
                                        Saison {season.season_number} • {season.episode_count} épisodes
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 
                          ⬇️ GRILLE DES ÉPISODES AVEC SCROLL
                        */}
                        <div className="
                            flex-1
                            overflow-y-auto 
                            pr-1
                            min-h-0
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:bg-gray-800
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-blue-600
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:hover:bg-blue-700
                        ">
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: episodeCount }, (_, i) => i + 1).map((epNum) => (
                                    <button
                                        key={epNum}
                                        onClick={() => handleEpisodeClick(epNum)}
                                        className={`
                                            rounded 
                                            px-2 
                                            py-2 
                                            text-xs 
                                            font-medium
                                            transition-all 
                                            duration-200
                                            ${
                                                selectedEpisode === epNum
                                                    ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-lg shadow-red-900/30'
                                                    : 'bg-gray-800 text-gray-200 hover:bg-red-600 hover:text-white hover:scale-105'
                                            }
                                        `}
                                    >
                                        Ép. {epNum}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Scroll indicator */}
                        {episodeCount > 20 && (
                            <div className="
                                text-center 
                                text-gray-500 
                                text-[10px] 
                                mt-1 
                                flex-shrink-0
                                animate-pulse
                            ">
                                ↓ Faites défiler pour plus d'épisodes ↓
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeriesPlayer;