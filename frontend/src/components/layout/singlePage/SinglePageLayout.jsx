"use client";
import React, { useEffect } from 'react';
import TopHeader from "@/components/singlePage/TopHeader";
import Sidebar from "./Sidebar";
import SubscriptionBox from "@/components/subscription/SubscriptionBox";

const SinglePageLayout = ({ children, data, type }) => {
    
    useEffect(() => {
        console.log("Layout - Données reçues :", data);
    }, [data]);

    if (!data || Object.keys(data).length === 0) {
        return <div className="text-white p-10 text-center text-xl">Aucune donnée disponible.</div>;
    }

    // Extraction flexible pour gérer data.movie, data.series ou data direct
    const movieData = data.movie || data.series || data;

    const { 
        _id, id, title, name, original_title, description, desc, overview,
        cover, thumbnail, poster, image, backdrop, poster_path, backdrop_path,
        original_language, genres = [], director = "Inconnu", 
        release_date, releaseDate, first_air_date, vote_average, imdb_rating, rotten_rating 
    } = movieData;

    // Calcul des valeurs d'affichage avec fallback sur les champs TMDB
    const displayTitle = title || name || original_title || "Titre inconnu";
    const displayDesc = description || desc || overview || "Aucune description disponible.";
    
    // Construction de l'image (priorité aux chemins complets, sinon construction depuis TMDB)
    let imageToUse = thumbnail || poster || cover || image || backdrop || "";
    if (poster_path || backdrop_path) {
        const path = poster_path || backdrop_path;
        imageToUse = `https://image.tmdb.org/t/p/w500${path}`;
    }
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    if (imageToUse && typeof imageToUse === 'string' && !imageToUse.startsWith('http')) {
        const formattedPath = imageToUse.startsWith('/') ? imageToUse : `/${imageToUse}`;
        imageToUse = `${API_URL}${formattedPath}`;
    }

    return (
        <main className="container mx-auto px-4 py-6">
            <TopHeader 
                id={_id || id} 
                title={displayTitle} 
                description={displayDesc} 
                cover={imageToUse} 
                thumbnail={imageToUse} 
            />

            <section className="grid grid-cols-12 xl:gap-8 lg:gap-4 gap-6 xl:mt-24 md:mt-16 mt-10 mb-12">
                <article className="lg:col-span-8 col-span-12 space-y-6 max-lg:order-2">
                    {children ? children : <p className="text-white">Aucun contenu additionnel.</p>}
                </article>

                <Sidebar
                    releaseDate={release_date || first_air_date || releaseDate || "N/A"}
                    language={original_language || "N/A"}
                    rating={[
                        { source: 'IMDb', score: vote_average || imdb_rating || "N/A" }, 
                        { source: 'Rotten Tomatoes', score: rotten_rating || "N/A" }
                    ]}
                    director={director}
                    genres={genres}
                    type={type}
                />
            </section>

            <SubscriptionBox />
        </main>
    );
}

export default SinglePageLayout;