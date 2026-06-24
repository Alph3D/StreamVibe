import { Suspense } from "react";
import ReviewSection from "@/components/review/ReviewSection";
import CastSection from "@/components/singlePage/CastSection";
import Description from "@/components/singlePage/Description";
import SinglePageLayout from "@/components/layout/singlePage/SinglePageLayout";
import SinglePageSkeleton from "@/components/layout/singlePage/SinglePageSkeleton";
import { fetchSingleMovies } from "@/services/MovieService";
import StreamingSection from "@/components/singlePage/StreamingSection";

const SingleMovie = async ({ params }) => {
    // 1. Extraction du slug
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // 2. Récupération des données
    const movieData = await fetchSingleMovies(slug);
    const normalizedMovieData = movieData?.movie ?? movieData;

    // 3. Protection : Si aucune donnée, message explicite
    if (!normalizedMovieData || Object.keys(normalizedMovieData).length === 0) {
        return (
            <div className="container text-white text-center py-20">
                <h2 className="text-2xl">Contenu non trouvé.</h2>
                <p>Le film ou la série demandée n'existe pas ou est indisponible.</p>
            </div>
        );
    }

    // 4. Détection dynamique du type
    const isSeries = !!(normalizedMovieData.seasons || normalizedMovieData.type === 'series' || normalizedMovieData.category === 'Series');

    return (
        <Suspense fallback={<SinglePageSkeleton />}>
            <SinglePageLayout 
                data={normalizedMovieData} 
                type={isSeries ? "series" : "movie"}
            >
                <StreamingSection 
                    vidsrcUrl={normalizedMovieData.vidsrcUrl} 
                    imdbId={normalizedMovieData.imdb_id}
                    tmdbId={normalizedMovieData.tmdbId || normalizedMovieData._id || normalizedMovieData.id}
                    title={normalizedMovieData.title || normalizedMovieData.name || "Titre inconnu"} 
                    isSeries={isSeries} 
                />
                <Description 
                    description={normalizedMovieData.description || "Pas de description disponible."} 
                />
                <CastSection 
                    actors={normalizedMovieData.actors || []} 
                />
                <ReviewSection 
                    id={normalizedMovieData._id || normalizedMovieData.id} 
                />
            </SinglePageLayout>
        </Suspense>
    );
}

export default SingleMovie;