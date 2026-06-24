"use client";
import { useState } from 'react';

const SeasonsDisplay = ({ seasons }) => {
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || null);

  if (!seasons || seasons.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-gray-800 bg-gray-900/80 p-3 text-white shadow-lg">
      <div className="mb-3">
        <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-gray-400">
          Choisir une saison
        </label>
        <select 
          className="w-full rounded border border-gray-700 bg-gray-800 p-2 text-sm text-white"
          onChange={(e) => setSelectedSeason(seasons[e.target.value])}
        >
          {seasons.map((season, index) => (
            <option key={season.seasonNumber} value={index}>
              Saison {season.seasonNumber} • {season.episodeCount} épisodes
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {selectedSeason && Array.from({ length: selectedSeason.episodeCount }).map((_, i) => (
          <button 
            key={i} 
            className="rounded bg-gray-800 px-2 py-2 text-xs text-gray-200 transition hover:bg-red-600"
          >
            Ép. {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeasonsDisplay;