import { Suspense } from "react";
import { fetchSingleMovies } from "@/services/MovieService";
import StreamingSection from "@/components/singlePage/StreamingSection";
import SinglePageSkeleton from "@/components/layout/singlePage/SinglePageSkeleton";

const MovieWatchPage = async ({ params }) => {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const movieData = await fetchSingleMovies(slug);
    const normalizedMovieData = movieData?.movie ?? movieData;

    if (!normalizedMovieData || Object.keys(normalizedMovieData).length === 0) {
        return (
            <div className="container text-white text-center py-20">
                <h2 className="text-2xl">Film introuvable.</h2>
                <p>Le film demandé n'existe pas ou est indisponible pour le moment.</p>
            </div>
        );
    }

    return (
        <Suspense fallback={<SinglePageSkeleton />}>
            <main className="container mx-auto py-10 px-4">
                <h1 className="text-white text-3xl font-bold mb-6">{normalizedMovieData.title || normalizedMovieData.name || "Titre inconnu"}</h1>
                <StreamingSection
                    vidsrcUrl={normalizedMovieData.vidsrcUrl}
                    imdbId={normalizedMovieData.imdb_id}
                    tmdbId={normalizedMovieData.tmdbId || normalizedMovieData._id || normalizedMovieData.id}
                    title={normalizedMovieData.title || normalizedMovieData.name || "Titre inconnu"}
                    isSeries={false}
                />
            </main>
        </Suspense>
    );
};

export default MovieWatchPage;
