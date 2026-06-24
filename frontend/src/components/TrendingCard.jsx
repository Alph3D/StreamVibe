// components/TrendingCard.jsx
"use client";

import Link from "next/link";
import { useState } from "react";

const TrendingCard = ({ item, index }) => {
    const [imageError, setImageError] = useState(false);
    
    const itemId = item.id || item._id;
    const title = item.title || item.name || "Titre inconnu";
    
    // Gestion de l'année
    let year = "2026";
    if (item.year) {
        year = item.year;
    } else if (item.first_air_date) {
        year = item.first_air_date.split('-')[0];
    } else if (item.release_date) {
        year = item.release_date.split('-')[0];
    }
    
    // Gestion du genre
    let genre = "DRAME";
    if (item.genres && item.genres.length > 0) {
        if (typeof item.genres[0] === 'string') {
            genre = item.genres[0];
        } else if (item.genres[0] && item.genres[0].name) {
            genre = item.genres[0].name;
        }
    }
    
    // Récupération de l'image
    const imagePath = item.thumbnail || item.poster_path || item.posterPath || item.image || item.cover || item.poster;
    
    // Construction de l'URL de l'image
    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `https://image.tmdb.org/t/p/w342${cleanPath}`;
    };
    
    const imageUrl = getImageUrl(imagePath);

    return (
        <Link 
            href={`/series/${itemId}/watch`}
            className="group cursor-pointer"
        >
            {/* Conteneur de l'image - Plus petit et élégant */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800/30 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {imageUrl && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-b from-gray-700/50 to-gray-900/50 flex items-center justify-center p-2">
                        <span className="text-xs text-gray-400 text-center line-clamp-3 font-light">
                            {title}
                        </span>
                    </div>
                )}
                
                {/* Badge de classement - Plus discret */}
                {index < 3 && (
                    <div className="absolute top-2 left-2 bg-red-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        #{index + 1}
                    </div>
                )}
                
                {/* 
                    🎯 OVERLAY AU SURVOL - Très transparent et élégant
                */}
                <div className="
                    absolute 
                    inset-0 
                    bg-black/20 
                    opacity-0 
                    group-hover:opacity-100 
                    transition-opacity 
                    duration-300 
                    flex 
                    items-center 
                    justify-center
                    backdrop-blur-[1px]
                ">
                    <span className="
                        text-white 
                        text-xs 
                        font-medium 
                        bg-red-600/70 
                        backdrop-blur-sm
                        px-3 
                        py-1.5 
                        rounded-full 
                        transform 
                        -translate-y-2 
                        group-hover:translate-y-0 
                        transition-transform 
                        duration-300 
                        ease-out
                        border 
                        border-white/10
                        shadow-lg
                        shadow-red-600/20
                    ">
                        ▶ Regarder
                    </span>
                </div>
            </div>

            {/* Textes sous l'image - Plus fins et élégants */}
            <div className="mt-2 space-y-0.5">
                <h3 className="text-xs font-medium text-white/90 truncate group-hover:text-red-400 transition-colors duration-200">
                    {title}
                </h3>
                <p className="text-[10px] text-gray-500/70 tracking-wide uppercase">
                    {year} • {genre}
                </p>
            </div>
        </Link>
    );
};

export default TrendingCard;