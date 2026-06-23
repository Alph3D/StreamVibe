"use client";
import MultipleCard from "@/components/MultipleCard";
import SlidePagination from "@/components/SlidePagination";
import { useEffect, useRef, useState } from "react";
import MultipleCardSkeleton from "@/components/MultipleCardSkeleton";
import { fetchTopRatedCategories, fetchMovieCategories, getPopularMovies } from "@/services/MovieService";

const TopMovieSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const getCategories = async () => {
            const data = await fetchTopRatedCategories();
            setCategories(data);
            setLoading(false);
        };
        getCategories();
    }, []);

    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, categories.length - 1));
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
            setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
    };

    // Fonction de nettoyage pour extraire uniquement l'URL textuelle
    const cleanThumbnails = (rawImages) => {
        if (!Array.isArray(rawImages)) return [];
        return rawImages.map(img => {
            if (typeof img === 'string') return img;
            if (img && typeof img === 'object') {
                return img.url || img.image || img.thumbnail || '';
            }
            return '';
        }).filter(Boolean); // Supprime les chaînes vides
    };

    const categoryEntries = categories ? Object.entries(categories) : [];

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-white 3xl:text-2.5xl md:text-1.5xl text-lg font-medium">Popular Top 10 In Genres</h5>
                <SlidePagination currentIndex={currentIndex} onNext={handleNext} onPrev={handlePrev} total={categoryEntries.length} />
            </div>

            <div
                ref={scrollContainerRef}
                className="flex lg:gap-8 gap-4 flex-nowrap overflow-x-auto pb-2.5 custom-scrollbar custom-scrollbar-sm"
            >
                {loading || categoryEntries.length === 0
                    ? Array.from({ length: 5 }).map((_, index) => <MultipleCardSkeleton key={index} />)
                    : categoryEntries.map(([category, thumbnail], index) => (
                        <MultipleCard 
                            key={index} 
                            title={category} 
                            images={cleanThumbnails(thumbnail)} // <-- On nettoie le tableau ici pour éviter le [object Object]
                            baseurl={"/movies/genres"} 
                            topRated 
                        />
                    ))}
            </div>
        </div>
    );
}

export default TopMovieSection;