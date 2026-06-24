// app/series/[slug]/watch/page.jsx
import { fetchSingleSeries, getTrendingSeries } from "@/services/SeriesService";
import StreamingSection from "@/components/singlePage/StreamingSection";
import TrendingCard from "@/components/TrendingCard";
import Link from "next/link";

export default async function WatchPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    const [seriesData, trendingData] = await Promise.all([
        fetchSingleSeries(slug),
        getTrendingSeries(1),
    ]);

    if (!seriesData || !seriesData.series) {
        return (
            <div className="min-h-screen bg-[#1C1C1B] flex items-center justify-center">
                <div className="text-white text-center py-20">
                    <h1 className="text-2xl font-bold mb-4">Série introuvable</h1>
                    <p className="text-gray-400">La série que vous recherchez n'existe pas ou a été supprimée.</p>
                    <Link href="/" className="mt-4 inline-block text-blue-500 hover:text-blue-400">
                        Retour à l'accueil →
                    </Link>
                </div>
            </div>
        );
    }

    const { series } = seriesData;
    const finalImdbId = series.imdb_id;
    const trendingNow = trendingData?.series || [];

    // 🔍 Debug: Afficher les données des saisons
    console.log("📊 Données de la série:", series);
    console.log("📊 Saisons:", series.seasons);

    return (
        <main className="min-h-screen bg-[#1C1C1B]">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                
                {/* LECTEUR VIDÉO avec sélecteur intégré */}
                <div className="w-full max-w-4xl mx-auto">
                    <StreamingSection 
                        imdbId={finalImdbId}
                        tmdbId={series.tmdbId || series._id || slug}
                        title="" 
                        isSeries={true}
                        seasons={series.seasons || []}
                    />

                    {/* TITRE ET DESCRIPTION */}
                    <div className="mt-6 space-y-4">
                        <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                            {series.title} 
                            <span className="text-gray-500 text-xl md:text-2xl lg:text-3xl ml-3">
                                ({series.year || new Date().getFullYear()})
                            </span>
                        </h1>
                        
                        <p className="text-sm text-gray-400 max-w-3xl leading-relaxed">
                            {series.overview || series.description || "Description non disponible."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {series.genres && series.genres.map((genre, index) => (
                                <span 
                                    key={index}
                                    className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-800/50 rounded-full border border-gray-700"
                                >
                                    {typeof genre === 'string' ? genre : genre.name}
                                </span>
                            ))}
                            {series.seasons && (
                                <span className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-800/50 rounded-full border border-gray-700">
                                    {series.seasons.length} Saisons
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔥 SECTION "TRENDING NOW" */}
                {trendingNow.length > 0 && (
                    <section className="mt-12">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white/90 tracking-wide">
                                🔥 Trending Now
                            </h2>
                            <Link 
                                href="/trending" 
                                className="text-xs text-gray-500 hover:text-white/80 transition-colors"
                            >
                                Voir tout →
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {trendingNow.slice(0, 10).map((item, index) => (
                                <TrendingCard 
                                    key={item.id || item._id || index} 
                                    item={item} 
                                    index={index} 
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}