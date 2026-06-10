"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { SpinnerSvg } from "@/assets/Svgs";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { getNewReleasedSeries } from "@/services/SeriesService";

const NewReleasedSeriesPage = () => {
    const [series, setSeries] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loading, setLoading] = useState(false);

    const effectRan = useRef(false);

    // Correction de useCallback : on passe la bonne page cible en paramètre sans dépendre de l'état local instable
    const fetchSeries = useCallback(async (pageToFetch) => {
        setLoading(true);
        try {
            const data = await getNewReleasedSeries(pageToFetch);
            if (data && data.series) {
                setSeries(prevSeries => [...prevSeries, ...data.series]);
                setHasNextPage(data.pagination?.hasNextPage || false);
            }
        } catch (error) {
            console.error("Error fetching series:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Gestion propre du premier rendu strict de Next.js
    useEffect(() => {
        if (!effectRan.current) {
            fetchSeries(1);
            effectRan.current = true;
        }
    }, [fetchSeries]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSeries(nextPage);
    };

    return (
        <main className="container py-20">
            <div className="relative border border-c-black-15 rounded-xl xl:pt-8 xl:pb-10 pt-3 pb-10 lg:px-10 md:px-6 px-4">

                <h1
                    className="inline-flex absolute md:top-[-22.5px] top-[-19px] 3xl:text-super-base xl:text-base font-medium
                     text-super-sm items-center tracking-wide bg-c-red-45 text-white rounded-md px-6 md:h-[45px] h-[38px]"
                >
                    New Released Series
                </h1>

                <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-8 mt-10">

                    {/* Correction majeure : On affiche les séries déjà chargées même si loading est true (pour le Load More) */}
                    {series.map(({ _id, title, duration, thumbnail, views, averageRating }) => (
                        <MovieCard series special key={_id} id={_id} title={title} image={thumbnail} duration={duration} view={views} rate={averageRating} />
                    ))}
                    
                    {/* Le skeleton ne s'affiche qu'au chargement initial lorsque la liste est encore vide */}
                    {loading && series.length === 0 && Array.from({ length: 12 }).map((_, index) => (
                        <MovieCardSkeleton special key={index} />
                    ))}

                </div>

                {/* Correction du point-virgule parasite qui traînait après l'expression JSX */}
                {hasNextPage && (
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={loadMore}
                            className="bg-c-red-45 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                            disabled={loading}
                        >
                            {loading && series.length > 0 ? 'Loading...' : 'Load More'}
                            <div className={loading ? "block" : "hidden"} role="status">
                                <SpinnerSvg />
                                <span className="sr-only">Loading...</span>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default NewReleasedSeriesPage;