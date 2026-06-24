// components/EpisodeGrid.jsx
"use client";

const EpisodeGrid = ({ 
    season, 
    episodeCount = 20, 
    selectedEpisode, 
    onEpisodeClick 
}) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {Array.from({ length: episodeCount }, (_, i) => i + 1).map((epNum) => (
                <button
                    key={epNum}
                    onClick={() => onEpisodeClick(epNum)}
                    className={`p-2 rounded-lg text-center text-xs transition-all ${
                        selectedEpisode === epNum
                            ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg shadow-blue-900/30'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                >
                    <span className="block font-mono font-bold">Ép. {epNum}</span>
                    {selectedEpisode === epNum && (
                        <span className="text-[8px] opacity-70">▶</span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default EpisodeGrid;