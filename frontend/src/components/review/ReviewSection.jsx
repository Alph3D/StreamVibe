"use client";

import ReviewItem from "./ReviewItem";
import ReviewItemSkeleton from "./ReviewItemSkeleton";
import { useEffect, useRef, useState } from "react";
import ReviewSectionTitle from "./ReviewSectionTitle";
import DialogModal from "../modal/DialogModal";
import AddReviewForm from "./AddReviewForm";
import { fetchReviews } from "../../services/ReviewService";
import useUserStore from "@/stores/useUserStore";
import { LeftArrowSvg } from "@/assets/Svgs";


const ReviewSection = ({ id }) => {
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const scrollContainerRef = useRef(null);
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        const getReviews = async () => {
            const data = await fetchReviews(id);
            setPreviews(data);
            setLoading(false);
        };
        getReviews();
    }, [id]);


    const handleNext = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-c-black-10 border border-c-black-15 rounded-2xl xl:py-7 xl:px-7 md:px-6 md:py-6 px-5 py-5">
            <ReviewSectionTitle setIsOpen={setIsOpen} prev={handlePrev} next={handleNext} />
            <div
                ref={scrollContainerRef}
                className="flex 3xl:gap-6 lg:gap-[2%] gap-4 flex-nowrap overflow-x-auto custom-scrollbar custom-scrollbar-sm pb-2.5"
            >

                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => <ReviewItemSkeleton key={index} />)
                ) : !previews || previews.length === 0 ? ( // Sécurité renforcée ici
                    <p className="text-white 2xl:text-base xl:text-super-sm md:text-sm text-super-xs">
                        No reviews posted yet. Your feedback helps!
                    </p>
                ) :
                    (
                        // Utilisation du point d'interrogation (?) de sécurité avant le map
                        previews?.map(({ fullName, rating, text }, index) => (
                            <ReviewItem
                                key={index}
                                fullName={fullName}
                                text={text}
                                rating={rating}
                            />
                        ))
                    )}

            </div>
            <div className="flex md:hidden gap-2.5 justify-center mt-3">
                <button
                    className="bg-c-black-08 border border-c-black-15 rounded-full flex items-center justify-center
                    md:w-11 md:h-11 w-[2.9rem] h-[2.9rem]"
                    onClick={handlePrev}
                >
                    <LeftArrowSvg className="stroke-c-grey-60 w-[17px] h-[17px]" />
                </button>
                <button
                    className="bg-c-black-08 border border-c-black-15 rounded-full flex items-center justify-center
                    md:w-11 md:h-11 w-[2.9rem] h-[2.9rem]"
                    onClick={handleNext}
                >
                    <LeftArrowSvg className="stroke-c-grey-60 w-[17px] h-[17px] rotate-180" />
                </button>
            </div>

            <DialogModal user={user} isOpen={isOpen} setIsOpen={setIsOpen} title={"Add Your Review"}>
                <AddReviewForm mediaId={id} user={user} setIsOpen={setIsOpen} />
            </DialogModal>

        </div>
    )
};

export default ReviewSection;