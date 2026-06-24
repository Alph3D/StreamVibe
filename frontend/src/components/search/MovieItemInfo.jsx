import Link from "next/link";
import StarRating from "../common/StarRating";

const MovieItemInfo = ({ type, id, title, rate, description, genres, handleClose }) => {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-5">
                <Link href={`/${type === "movie" ? "movies" : "series"}/${id}`} onClick={handleClose}>
                    <h6
                        className="capitalize text-xl font-medium text-white/95"
                    >
                        {title}
                    </h6>
                </Link>
                <div className={`inline-block bg-c-black-08 border border-c-black-15 rounded-full 3xl:py-1.5 py-0.5 3xl:px-4 px-3`}>
                    <StarRating rating={rate} />
                </div>
            </div>
            <p className="text-c-grey-90 text-super-sm leading-6 line-clamp-3">
                {description || "No description available yet"}
            </p>

            <ul className="flex items-center gap-1 capitalize mt-3 text-c-grey-75/85 text-super-sm">
                {genres?.map((genre, index) => (
                    <li key={index}>{genre} /</li>
                ))}
            </ul>

        </div>
    );
}

export default MovieItemInfo;