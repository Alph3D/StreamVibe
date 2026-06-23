"use client";
import { useState } from "react";

const StreamingSection = ({ vidsrcUrl, imdbId, isSeries = false, title }) => {
    // État pour les séries uniquement
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);

    // Si c'est une série, on reconstruit l'URL dynamiquement
    const activeUrl = isSeries && imdbId
        ? `https://vidsrc.to/embed/tv/${imdbId}/${season}/${episode}`
        : vidsrcUrl;

    if (!activeUrl) {
        return <div className="text-white p-4 bg-gray-800 rounded-xl text-center">Lecteur vidéo indisponible.</div>;
    }

    return (
        <div className="space-y-4">
            {/* Lecteur Vidéo */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-c-black-15">
                <iframe
                    src={activeUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </div>

            {/* Sélecteurs pour séries */}
            {isSeries && (
                <div className="flex gap-4 p-4 bg-c-black-10 rounded-xl">
                    <input 
                        type="number" min="1" value={season} onChange={(e) => setSeason(e.target.value)}
                        className="bg-c-black-15 text-white p-2 rounded w-20" placeholder="Saison"
                    />
                    <input 
                        type="number" min="1" value={episode} onChange={(e) => setEpisode(e.target.value)}
                        className="bg-c-black-15 text-white p-2 rounded w-20" placeholder="Épisode"
                    />
                </div>
            )}
        </div>
    );
};

export default StreamingSection;