import { API_BASE_URL } from "@/services/api";

export const fetchMovieCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/categories`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie categories:', error);
        return [];
    }
};


export const fetchTopRatedCategories = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/top-rated?limit=4`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.movies;
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        return [];
    }
}


export const getTrendingMovies = async (currentPage, page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/trending-movies?page=${currentPage || page || 1}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}

export const getNewReleasedMovies = async (currentPage, page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/new-released?page=${currentPage || page || 1}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}

export const getPopularMovies = async (currentPage, page) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/popular-movies?page=${currentPage || page || 1}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
}

export const fetchSingleMovies = async (slug) => {
    console.log(slug)
    try {
        const res = await fetch(`${API_BASE_URL}/movie/${slug}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching single movie:', error);
        return null;
    }
}

export const downloadMovieApi = async (url) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/download`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error('Download error:', error);
    }
};


export const fetchGenreMovies = async (genre, currentPage, page, topRated) => {
    try {
        const response = await fetch(`${API_BASE_URL}/movie/moviesByGenre/${genre}?page=${currentPage || page || 1}&topRated=${topRated}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching genre movies:", error);
        return [];
    }
}