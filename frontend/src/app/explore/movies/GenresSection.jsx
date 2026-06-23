"use client";
import MultipleCard from "@/components/MultipleCard";
import SlidePagination from "@/components/SlidePagination";
import { useEffect, useRef, useState } from "react";
import { fetchMovieCategories } from "@/services/MovieService";
import MultipleCardSkeleton from "@/components/MultipleCardSkeleton";

const GenresSection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const getCategories = async () => {
            const data = await fetchMovieCategories();
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

    return (
        <div className="md:mt-9 mt-5">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-white 3xl:text-2.5xl md:text-1.5xl text-xl font-medium">Our Genres</h5>
                <SlidePagination currentIndex={currentIndex} onNext={handleNext} onPrev={handlePrev} total={categories ? categories.length : 0} />
            </div>

            <div
                ref={scrollContainerRef}
                className="flex lg:gap-8 gap-4 flex-nowrap overflow-x-auto pb-2.5 custom-scrollbar custom-scrollbar-sm"
            >
                {loading || categories?.length === 0
                    ? Array.from({ length: 5 }).map((_, index) => <MultipleCardSkeleton key={index} />)
                    : Object.entries(categories).map(([category, images], index) => (
                        <MultipleCard key={index} title={category} images={images} baseurl={"/movies/genres"} />
                    ))}
            </div>
        </div>
    );
}

export default GenresSection;