"use client"
import React, { useState, useRef, useEffect } from 'react';
import MultipleCardSkeleton from '../MultipleCardSkeleton';
import MultipleCard from '../MultipleCard';
import MovieCategoryTitle from './MovieCategoryTitle';
import { fetchMovieCategories } from "@/services/MovieService";


const HomeMovieCategory = () => {
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
        <section className="container mt-14">
            <MovieCategoryTitle
                totalSlides={categories ? categories.length : 0}
                currentIndex={currentIndex}
                onNext={handleNext}
                onPrev={handlePrev}
            />
            <div
                ref={scrollContainerRef}
                className="flex lg:gap-8 md:gap-4 gap-2.5 flex-nowrap overflow-x-auto pb-2.5 custom-scrollbar custom-scrollbar-sm"
            >
                {loading || categories?.length === 0
                    ? Array.from({ length: 5 }).map((_, index) => <MultipleCardSkeleton key={index} />)
                    : Object.entries(categories).map(([category, images], index) => (
                        <MultipleCard key={index} title={category} images={images} baseurl={"/explore"} />
                    ))}
            </div>
        </section>
    );
};


export default HomeMovieCategory;