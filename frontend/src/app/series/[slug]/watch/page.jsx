// app/series/[slug]/watch/page.jsx
import { fetchSingleSeries } from "@/services/SeriesService";
import dynamic from 'next/dynamic';

// 🔥 Chargement dynamique de la page Watch générale
const WatchPage = dynamic(() => import('@/app/watch/[id]/page'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#1C1C1B] flex items-center justify-center">
            <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-400">Chargement du lecteur...</p>
            </div>
        </div>
    )
});

// Next.js fournit nativement params ET searchParams aux pages de composants serveurs
export default async function SeriesWatchPage({ params, searchParams }) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    
    const slug = resolvedParams.slug;
    
    // Récupération automatique de la saison (s) et de l'épisode (e) depuis l'URL (par défaut Saison 1 Épisode 1)
    const season = resolvedSearchParams.s || resolvedSearchParams.season || '1';
    const episode = resolvedSearchParams.e || resolvedSearchParams.episode || '1';
    
    const seriesData = await fetchSingleSeries(slug);
    const series = seriesData?.series || seriesData;

    if (!series) {
        return (
            <div className="min-h-screen bg-[#1C1C1B] flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Série introuvable</h1>
                    <p className="text-gray-400">La série demandée n'existe pas.</p>
                </div>
            </div>
        );
    }

    // 🔥 Extraction sécurisée du vrai ID TMDB
    const tmdbId = series.tmdbId || series.id || series._id;
    
    // 🔥 Créer les props complètes et corrigées pour WatchPage
    // On lui injecte enfin le type, la saison et l'épisode pour effacer l'erreur {tmdbid}
    const watchProps = {
        params: { id: String(tmdbId) },
        searchParams: { 
            type: 'tv',
            season: String(season),
            episode: String(episode)
        }
    };
    
    return <WatchPage {...watchProps} />;
}
