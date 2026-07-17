// frontend/components/home/HomeMovieCategory.jsx
"use client";

import { useState, useEffect } from "react";
import { getPopularSeries, getTrendingSeries } from "@/services/api";
import Link from "next/link";

const HomeMovieCategory = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPopularSeries(1);
        setSeries(data?.series || []);
      } catch (error) {
        console.error('❌ Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">🎬 À découvrir</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {series.slice(0, 10).map((item) => {
          const id = item._id || item.id;
          const title = item.title || item.name || "Titre inconnu";
          const imageUrl = getImageUrl(item.thumbnail || item.poster_path || item.posterPath);
          
          return (
            <Link key={id} href={`/series/${id}/watch`} className="group cursor-pointer">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center';
                        fallback.innerHTML = `<span class="text-xs text-gray-400 text-center px-2">${title}</span>`;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">{title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium bg-red-600 px-4 py-2 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform">
                    Regarder
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-white truncate group-hover:text-red-500 transition-colors">{title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomeMovieCategory;