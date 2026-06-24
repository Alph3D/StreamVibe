import { Suspense } from "react";

import ReviewSection from "@/components/review/ReviewSection";
import CastSection from "@/components/singlePage/CastSection";
import Director from "@/components/singlePage/Director";
import Genres from "@/components/singlePage/Genres";
import Musician from "@/components/singlePage/Musician";
import Rating from "@/components/singlePage/Rating";
import ReleasedMovie from "@/components/singlePage/ReleasedMovie";
import DownloadSection from "../../../../../components/singlePage/DownloadSection";
import EpisodePageSkeleton from "./EpisodePageSkeleton";
import { fetchSingleEpisode } from "@/services/SeriesService";


const SingleEpisodePage = async ({ params }) => {
    const { slug: seriesId, season, episode } = params;
    const seriesData = await fetchSingleEpisode(seriesId, season, episode);

    if (!seriesData) return <EpisodePageSkeleton />;

    const { title, series, pictures, files } = seriesData;
    const { title: seriesTitle, director, release_date, genres, rotten_rating, imdb_rating, actors } = series;


    return (
        <Suspense fallback={<EpisodePageSkeleton />}>
            <main className="container md:pt-10 pt-5 md:pb-20 pb-10">
                <div className="lg:w-[85%] mx-auto space-y-6">

                    <section className="bg-c-black-10 border border-c-black-15 xl:py-9 xl:px-9 md:px-5 md:py-5 px-3.5 py-3.5 rounded-2.5xl">
                        <div className="aspect-video rounded-[0.9rem] overflow-hidden">
                            <StreamingSection 
                                isSeries={true}
                                tmdbId={series.tmdb_id} // Assurez-vous que cet ID existe dans votre objet 'series'
                                imdbId={series.imdb_id} // Ou series.imdb_id selon la structure de votre API
                                season={season}
                                episode={episode}
                                title={seriesTitle}
                            />
                        </div>
                        <div className="mt-6">
                            <h1 className="xl:text-3xl md:text-2xl text-lg font-semibold text-white capitalize">
                                {seriesTitle} - Episode {episode}
                            </h1>
                            <p className="mt-2 xl:text-lg md:text-super-base text-sm font-medium text-c-grey-70">
                                Season {season} - Episode {episode}
                            </p>
                            <p className="mt-3 text-c-grey-65 xl:text-lg md:text-super-base text-super-xs tracking-wide">
                                {title}
                            </p>
                        </div>
                    </section>

                    <section className="bg-c-black-10 border border-c-black-15 xl:py-7 xl:px-7 md:px-5 md:py-5 px-3.5 py-3.5 rounded-2.5xl">

                        <h4
                            className="text-white md:text-xl text-super-base font-medium lg:mb-8 md:mb-5 mb-3.5"
                        >
                            Series Info
                        </h4>

                        <Rating custom ratings={[{ source: 'IMDb', score: imdb_rating }, { source: 'Rotten Tomatoes', score: rotten_rating }]} />

                        <div className="grid md:grid-cols-2 md:gap-10 gap-6 mt-8">

                            <Genres custom genres={genres} />

                            <ReleasedMovie custom year={release_date} />

                        </div>

                        <div className="grid md:grid-cols-2 md:gap-10 gap-6 mt-8">

                            <Director custom director={director} />

                            <Musician custom musician={{ name: 'Kyle Dixon', country: 'USA', image: '/images/musician.jpg' }} />

                        </div>

                    </section>

                    <CastSection actors={actors} />

                    <DownloadSection files={files} seriesTitle={seriesTitle} season={season} episode={episode} />

                    <ReviewSection id={seriesId} />

                </div>
            </main>
        </Suspense>
    );
}

export default SingleEpisodePage;