"use client";
import HeaderCallToAction from "../singlePage/HeaderCallToAction";

export default function TopHeader({ id, title, description, cover, thumbnail, type = "series" }) {
    
    const getBannerUrl = () => {
        const src = cover || thumbnail;

        if (!src) return "/placeholder-banner.png";
        if (src.startsWith('http')) return src;
        
        // Nettoyage au cas où l'URL commence par un slash
        const cleanSrc = src.startsWith('/') ? src.substring(1) : src;
        return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${cleanSrc}`;
    };

    return (
        <div className="relative w-full xl:h-[80vh] md:h-[60vh] h-[50vh] overflow-hidden rounded-xl">
            <img
                src={getBannerUrl()}
                alt={`${title} banner`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 60%" }}
            />

            <div className="w-full absolute bottom-0 md:pb-10 pb-8 pt-20 text-center md:px-20 px-4 bg-gradient-to-t from-c-black-08/90 via-c-black-08/60 via-65% to-transparent">
                <h1 className="text-2.5xl text-white font-semibold">{title}</h1>
                <p className="line-clamp-2 md:text-c-grey-60 text-c-grey-90 2xl:text-base xl:text-super-sm text-sm md:mt-3 mt-1 mb-5 md:block hidden">
                    {description || "Aucune description disponible pour le moment."}
                </p>
                
                {/* On passe le type pour que le bouton sache s'il va vers /series/.../watch ou /movies/.../watch */}
                <HeaderCallToAction mediaId={id} type={type} />
            </div>
        </div>
    );
}