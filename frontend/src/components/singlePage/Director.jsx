import Link from "next/link";

const Director = ({ custom, director }) => {
    // Sécurité : Si director est null ou undefined, on affiche un message propre au lieu de crasher
    if (!director) {
        return (
            <div>
                <p className={`text-c-grey-60 ${custom && "md:text-super-base"}`}>Director</p>
                <div className={`bg-c-black-08 border border-c-black-15 rounded-lg text-c-grey-60 text-sm italic ${custom ? "p-3.5 mt-2.5" : "py-3 px-3 mt-2.5"}`}>
                    No director information available
                </div>
            </div>
        );
    }

    const { _id: id, fullName, birthPlace, profile } = director;

    // Gestion du lien de l'image (si absolue ou relative)
    const getImageUrl = (src) => {
        if (!src) return "/placeholder-avatar.png"; // Ajoute un avatar par défaut si vide
        if (src.startsWith('http://') || src.startsWith('https://')) {
            return src;
        }
        return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${src}`;
    };

    return (
        <div>
            <p className={`text-c-grey-60 ${custom && "md:text-super-base"}`}>Director</p>
            <div className={`flex bg-c-black-08 border border-c-black-15 rounded-lg ${custom ? "p-3.5 mt-2.5" : "py-3 px-3 mt-2.5"}`}>
                <Link href={`/directors/${id}`}>
                    <img
                        src={getImageUrl(profile)}
                        alt={`${fullName || 'Unknown'} director`}
                        className={`${custom ? "w-16 h-16" : "w-12 h-12"} object-cover object-center rounded-lg mr-3`}
                    />
                </Link>
                <div className="flex flex-col justify-around capitalize">
                    <Link href={`/directors/${id}`} >
                        <h5 className={`text-white ${!custom && "text-super-sm"} max-md:text-super-sm tracking-wide`}>{fullName}</h5>
                    </Link>
                    {birthPlace && (
                        <span className={`block text-c-grey-60 ${custom ? "md:text-super-sm text-sm" : "text-sm"} `}>
                            From {birthPlace}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
};

export default Director;