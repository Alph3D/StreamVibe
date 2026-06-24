"use client";
import MultipleCard from "@/components/MultipleCard";
import SlidePagination from "@/components/SlidePagination";
import { useEffect, useRef, useState } from "react";
import { fetchMovieCategories } from "@/services/MovieService";
import MultipleCardSkeleton from "@/components/MultipleCardSkeleton";

const GenresSection = () => {
    // Initialisation en tant qu'objet vide pour correspondre à Object.entries()
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const data = await fetchMovieCategories();
            // Assure-toi que data est un objet. Si l'API renvoie null/undefined, on met {}
            setCategories(data || {});
            setLoading(false);
        };
        getCategories();
    }, []);

    // Conversion en tableau pour calculer la taille et gérer la pagination
    const categoryEntries = Object.entries(categories);

    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            setCurrentIndex((prev) => Math.min(prev + 1, categoryEntries.length - 1));
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
            setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <div className="md:mt-9 mt-5">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-white 3xl:text-2.5xl md:text-1.5xl text-xl font-medium">Our Genres</h5>
                <SlidePagination 
                    currentIndex={currentIndex} 
                    onNext={handleNext} 
                    onPrev={handlePrev} 
                    total={categoryEntries.length} 
                />
            </div>

            <div
                ref={scrollContainerRef}
                className="flex lg:gap-8 gap-4 flex-nowrap overflow-x-auto pb-2.5 custom-scrollbar custom-scrollbar-sm"
            >
                {loading 
                    ? Array.from({ length: 5 }).map((_, index) => <MultipleCardSkeleton key={index} />)
                    : categoryEntries.length === 0 
                        ? <span className="text-c-grey-60">No genres found.</span>
                        : categoryEntries.map(([category, images], index) => (
                            <MultipleCard 
                                key={category} 
                                title={category} 
                                images={images} 
                                baseurl={"/movies/genres"} 
                            />
                        ))
                }
            </div>
        </div>
    );
}

export default GenresSection;