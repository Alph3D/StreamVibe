// app/movies/[slug]/watch/page.jsx
import { fetchSingleMovies } from "@/services/MovieService";
import dynamic from 'next/dynamic';

// 🔥 Chargement dynamique de la page Watch
const WatchPage = dynamic(() => import('@/app/watch/[id]/page'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#1C1C1B] flex items-center justify-center">
            <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-400">Chargement du film...</p>
            </div>
        </div>
    )
});

export default async function MovieWatchPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    const movieData = await fetchSingleMovies(slug);
    const movie = movieData?.movie || movieData;

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#1C1C1B] flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl font-bold mb-4">Film introuvable</h1>
                    <p className="text-gray-400">Le film demandé n'existe pas.</p>
                </div>
            </div>
        );
    }

    // 🔥 Passer l'ID TMDB à la page Watch
    const tmdbId = movie.tmdbId || movie._id || movie.id;
    
    // 🔥 Créer les props pour WatchPage
    const watchProps = {
        params: { id: tmdbId },
        searchParams: { type: 'movie' }
    };
    
    return <WatchPage {...watchProps} />;
}