import { API_BASE_URL } from "@/services/api";

const handleFetchError = (err, context) => {
    console.error(`[MovieService Error] ${context}:`, err);
    return null;
};

// --- CATÉGORIES & LISTES ---
export const fetchMovieCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/categories`);
        return response.ok ? await response.json() : [];
    } catch (err) { return handleFetchError(err, 'fetchMovieCategories'); }
};

export const fetchTopRatedCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/top-rated?limit=4`);
        if (!response.ok) return [];
        const data = await response.json();
        return data.movies || [];
    } catch (err) { return handleFetchError(err, 'fetchTopRatedCategories'); }
};

export const fetchGenreMovies = async (genre, page = 1, maybePageOrTopRated = false, topRated = false) => {
    try {
        const resolvedPage = typeof page === 'number' && page > 0 ? page : 1;
        const resolvedTopRated = typeof maybePageOrTopRated === 'boolean' ? maybePageOrTopRated : Boolean(topRated);
        const response = await fetch(`${API_BASE_URL}/movie/moviesByGenre/${encodeURIComponent(genre)}?page=${resolvedPage}&topRated=${resolvedTopRated}`);

        if (!response.ok) return { movies: [] };
        return await response.json();
    } catch (err) {
        return handleFetchError(err, 'fetchGenreMovies');
    }
};

export const getPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/popular-movies?page=${page}`);
        return response.ok ? await response.json() : { movies: [] };
    } catch (err) { return { movies: [] }; }
};

// --- FONCTION AJOUTÉE (C'est celle qui manquait pour corriger ton erreur) ---
export const getNewReleasedMovies = async (page = 1) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/new-released?page=${page}`);
        return response.ok ? await response.json() : { movies: [] };
    } catch (err) { return { movies: [] }; }
};

// --- DÉTAILS (Films/Séries) ---
export const fetchSingleMovies = async (slug) => {
    try {
        const url = `${API_BASE_URL}/movie/${slug}`;
        const res = await fetch(url, { cache: 'no-store' });

        if (!res.ok) return null;

        const data = await res.json();
        const movieData = data?.movie ?? data;

        if (!movieData) return null;

        const idToUse = movieData?.tmdbId || movieData?.id || movieData?._id || data?.tmdbId || data?.id || data?._id;
        if (idToUse) {
            movieData.tmdbId = String(idToUse);
            movieData.vidsrcUrl = `https://www.2embed.cc/embed/tmdb/movie/${movieData.tmdbId}`;
        }

        if (!movieData.imdb_id && data?.movie?.imdb_id) {
            movieData.imdb_id = data.movie.imdb_id;
        }

        return movieData;
    } catch (err) { return handleFetchError(err, 'fetchSingleMovies'); }
};

export const fetchSingleSeries = async (slug) => {
    try {
        const url = `${API_BASE_URL}/series/${slug}`;
        const res = await fetch(url, { cache: 'no-store' });
        
        if (!res.ok) return null;
        return await res.json();
    } catch (err) { return handleFetchError(err, 'fetchSingleSeries'); }
};