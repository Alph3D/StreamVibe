// frontend/app/watch/[id]/page.js
'use client';

import { useEffect, useState } from 'react';

export default function WatchPage({ params, searchParams }) {
    // Lecture directe et immédiate des paramètres
    const tmdbId = params?.id;
    const type = searchParams?.type || 'movie';
    const season = searchParams?.season || '1';
    const episode = searchParams?.episode || '1';

    const [activeUrl, setActiveUrl] = useState('');
    const [backupSources, setBackupSources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tmdbId) return;

        async function fetchStreamFlux() {
            try {
                // Appel vers notre API locale sans aucun fetch sortant bloquant
                const res = await fetch(`/api/stream?tmdbId=${tmdbId}&type=${type}&season=${season}&episode=${episode}`);
                const data = await res.json();

                if (data.success) {
                    setActiveUrl(data.url);
                    setBackupSources(data.backupUrls || []);
                } else if (data.backupUrls && data.backupUrls.length > 0) {
                    setActiveUrl(data.backupUrls[0].url);
                    setBackupSources(data.backupUrls);
                }
            } catch (err) {
                console.error("Erreur de récupération du flux vidéo :", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStreamFlux();
    }, [tmdbId, type, season, episode]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1C1C1B] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs text-gray-400 tracking-wider">Connexion aux serveurs de flux...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1C1C1B] text-white p-6 flex flex-col items-center justify-center gap-6">
            
            {/* Zone d'affichage du lecteur Iframe */}
            <div className="w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
                {activeUrl ? (
                    <iframe
                        src={activeUrl}
                        className="w-full h-full border-0"
                        allowFullScreen
                        scrolling="no"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        Aucune source vidéo disponible pour cet épisode.
                    </div>
                )}
            </div>

            {/* Boutons de changement de serveurs et langues (VF / Multi) */}
            {backupSources.length > 0 && (
                <div className="flex gap-3 flex-wrap justify-center max-w-2xl">
                    {backupSources.map((source, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveUrl(source.url)}
                            className={`px-4 py-2 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-200 ${
                                activeUrl === source.url 
                                ? 'bg-red-600 text-white shadow-lg scale-105' 
                                : 'bg-[#262625] text-gray-400 hover:bg-[#323231] hover:text-white'
                            }`}
                        >
                            {source.name} [{source.lang}]
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
