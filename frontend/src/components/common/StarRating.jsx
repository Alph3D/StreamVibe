import { HalfStarIcon, OutlineStarIcon, StarIcon } from "@/assets/Svgs";

const StarRating = ({ special, rating }) => {
    // 1. On sécurise la note immédiatement en premier
    const safeRating = rating == null || isNaN(rating) ? 0 : parseFloat(rating);
    const formattedRating = Number.isInteger(safeRating) ? safeRating : parseFloat(safeRating.toFixed(1));

    // 2. On utilise safeRating (qui est obligatoirement un nombre valide) pour les tableaux
    const floorRating = Math.floor(safeRating);
    const filledStars = Array(Math.max(0, floorRating)).fill('filled');
    const halfStar = safeRating % 1 !== 0 ? ['half'] : [];
    
    // Sécurité pour s'assurer que la taille totale du tableau ne dépasse pas 5 ou ne tombe pas sous 0
    const emptyStarsCount = Math.max(0, 5 - floorRating - halfStar.length);
    const emptyStars = Array(emptyStarsCount).fill('empty');

    return (
        <div className="flex items-center 3xl:gap-1 gap-0.5">
            {filledStars.map((_, index) => (
                <StarIcon key={index}
                    className={`3xl:w-5 3xl:h-5 ${special ? "w-5 h-5 md:h-3.5 md:w-3.5" : "w-3.5 h-3.5"} text-c-red-45`}
                />
            ))}
            {halfStar.map((_, index) => (
                <HalfStarIcon key={index}
                    className={`3xl:w-5 3xl:h-5 ${special ? "w-5 h-5 md:h-3.5 md:w-3.5" : "w-3.5 h-3.5"} text-c-red-45`}
                />
            ))}
            {emptyStars.map((_, index) => (
                <OutlineStarIcon key={index}
                    className={`3xl:w-5 3xl:h-5 ${special ? "w-5 h-5 md:h-3.5 md:w-3.5" : "w-3.5 h-3.5"} fill-c-grey-60`}
                />
            ))}
            <span className={special ? "text-c-grey-60 max-md:text-super-base font-medium" : "text-c-grey-60"}>{formattedRating}</span>
        </div>
    );
};

export default StarRating;