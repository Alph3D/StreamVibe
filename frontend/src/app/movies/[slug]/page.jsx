import { Suspense } from "react";
import ReviewSection from "@/components/review/ReviewSection";
import CastSection from "@/components/singlePage/CastSection";
import Description from "@/components/singlePage/Description";
import SinglePageLayout from "@/components/layout/singlePage/SinglePageLayout";
import SinglePageSkeleton from "@/components/layout/singlePage/SinglePageSkeleton";
import { fetchSingleMovies } from "@/services/MovieService";
import StreamingSection from "@/components/singlePage/StreamingSection"; 

const SingleMovie = async ({ params }) => {
    // 1. Extraction sécurisée
    const { slug } = await params;

    // 2. Récupération des données
    const movieData = await fetchSingleMovies(slug);

    // 3. Protection : Si aucune donnée, on renvoie le Skeleton ou un message d'erreur
    if (!movieData) {
        return <div className="text-white text-center py-20">Film non trouvé.</div>;
    }

    // 4. Détection du type
    const isSeries = !!(movieData.seasons || movieData.type === 'series' || movieData.category === 'Series');

    return (
        <Suspense fallback={<SinglePageSkeleton />}>
            <SinglePageLayout data={movieData} type={isSeries ? "series" : "movie"}>
                <StreamingSection 
                    vidsrcUrl={movieData.vidsrcUrl} 
                    imdbId={movieData.imdb_id} 
                    title={movieData.title || "Titre inconnu"} 
                    isSeries={isSeries} 
                />
                <Description description={movieData.description || "Pas de description."} />
                <CastSection actors={movieData.actors || []} />
                <ReviewSection id={movieData._id} />
            </SinglePageLayout>
        </Suspense>
    );
}

export default SingleMovie;