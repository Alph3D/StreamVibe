import Link from "next/link";

const { EpisodeIcon } = require("@/assets/Svgs");

const Genres = ({ custom, genres, type }) => {
    return (
        <div>
            <p className={`text-c-grey-60 ${custom && "md:text-super-base"}`}>
                <EpisodeIcon className={`${custom ? "md:w-5 w-4" : "w-[18px]"} mr-1.5 inline`} />
                Genres
            </p>
            <div className={`flex flex-wrap md:gap-2.5 gap-1.5 ${custom ? "mt-3" : "mt-2.5"}`}>
                {/* Sécurité : on vérifie que genres existe et contient des éléments avant de faire le .map */}
                {genres && genres.length > 0 ? (
                    genres.map((genre, index) => (
                        <Link
                            key={index} 
                            href={`${type == "series" ? "/series" : "/movies"}/genres/${genre.toLowerCase()}`}
                            className={`bg-c-black-08 hover:bg-c-black-10 border border-c-black-15 md:text-base text-super-sm
                             rounded-md ${custom ? "px-7 py-1" : " px-4 py-1 text-super-sm"} text-white capitalize`}
                        >
                            {genre}
                        </Link>
                    ))
                ) : (
                    <span className="text-c-grey-60 text-sm italic">No genres specified</span>
                )}
            </div>
        </div>
    )
};

export default Genres;