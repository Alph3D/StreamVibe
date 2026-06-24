"use client";
import React, { useState, useRef, useEffect } from 'react';
import MultipleCardSkeleton from '../MultipleCardSkeleton';
import MultipleCard from '../MultipleCard';
import MovieCategoryTitle from './MovieCategoryTitle';
import { fetchMovieCategories } from "@/services/MovieService";

const HomeMovieCategory = () => {
    // 1. Initialiser avec un objet vide {} car tu utilises Object.entries()
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchMovieCategories();
                // 2. S'assurer qu'on enregistre bien un objet
                setCategories(data && typeof data === 'object' ? data : {});
            } catch (error) {
                console.error("Erreur chargement catégories:", error);
                setCategories({});
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    // Conversion en tableau pour calculer la longueur utilisée par MovieCategoryTitle
    const categoryEntries = Object.entries(categories || {});

    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, categoryEntries.length - 1));
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
                totalSlides={categoryEntries.length}
                currentIndex={currentIndex}
                onNext={handleNext}
                onPrev={handlePrev}
            />
            <div
                ref={scrollContainerRef}
                className="flex lg:gap-8 md:gap-4 gap-2.5 flex-nowrap overflow-x-auto pb-2.5 custom-scrollbar custom-scrollbar-sm"
            >
                {loading 
                    ? Array.from({ length: 5 }).map((_, index) => <MultipleCardSkeleton key={index} />)
                    : categoryEntries.length === 0
                        ? <p className="text-white">Aucune catégorie disponible.</p>
                        : categoryEntries.map(([category, images], index) => (
                            <MultipleCard 
                                key={category} 
                                title={category} 
                                images={images} 
                                baseurl={"/explore"} 
                            />
                        ))
                }
            </div>
        </section>
    );
};

export default HomeMovieCategory;