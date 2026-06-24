"use client";

import { PlaySvg, PlusSvg, SoundSvg } from "@/assets/Svgs";
import LikeButton from "./LikeButton";
import useUserStore from "@/stores/useUserStore";
import Link from "next/link"; // Import indispensable

const HeaderCallToAction = ({ mediaId, type = "series" }) => {
    const user = useUserStore((state) => state.user);
    
    // Définition dynamique de la route de lecture
    const watchUrl = type === "series" ? `/series/${mediaId}/watch` : `/movies/${mediaId}/watch`;

    return (
        <div className="flex md:flex-row flex-col items-center justify-center gap-3.5">
            {/* Remplacement du <button> par <Link> */}
            <Link 
                href={watchUrl}
                className="bg-c-red-45 text-white font-medium xl:h-12 h-11 px-6 flex items-center gap-1.5 rounded-md border-0 outline-none max-md:mt-3 hover:opacity-90 transition-opacity"
            >
                <PlaySvg className="w-[28px]" /> Play Now
            </Link>

            <div className="flex items-center gap-2.5">
                <button
                    className="xl:h-12 h-11 xl:w-12 w-11 bg-c-black-06 border border-c-black-15 rounded-md flex items-center justify-center hover:bg-c-black-15 transition"
                >
                    <PlusSvg />
                </button>
                
                <LikeButton userId={user?._id} media={mediaId} />
                
                <button
                    className="xl:h-12 h-11 xl:w-12 w-11 bg-c-black-06 border border-c-black-15 rounded-md flex items-center justify-center hover:bg-c-black-15 transition"
                >
                    <SoundSvg />
                </button>
            </div>
        </div>
    );
}

export default HeaderCallToAction;