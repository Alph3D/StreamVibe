import Link from "next/link";
import MovieItemInfo from "./MovieItemInfo";
import MovieItemThumbnail from "./MovieItemThumbnail";

const SearchMovieItem = ({ type, data, handleClose }) => {
    // Vérification de sécurité : si data est nul, on ne plante pas
    if (!data) return null;

    // Déstructuration sécurisée
    const { _id: id, title, thumbnail, poster, description, rate, genres } = data;

    // Détermine la source : si thumbnail est vide, on prend poster
    const imageSource = thumbnail || poster;

    return (
        <div className="w-full px-5 py-4 flex gap-6 bg-c-black-10/65 backdrop-blur-sm border-2 border-c-black-15 rounded-xl">
            <MovieItemThumbnail src={imageSource} title={title} />
            
            <div className="flex flex-col justify-between items-start flex-1 tracking-wide">
                <MovieItemInfo 
                    type={type} 
                    id={id} 
                    title={title} 
                    rate={rate} 
                    description={description} 
                    genres={genres} 
                    handleClose={handleClose} 
                />

                <Link href={`/${type === "movie" ? "movies" : "series"}/${id}${type === "movie" ? "" : "/watch"}`} onClick={handleClose}>
                    <button 
                        className="bg-c-red-45 text-white text-sm font-medium px-11 py-2 rounded-lg" 
                    >
                        Watch Now
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default SearchMovieItem;