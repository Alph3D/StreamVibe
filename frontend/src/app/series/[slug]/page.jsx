import { Suspense } from "react";

import ReviewSection from "@/components/review/ReviewSection";
import CastSection from "@/components/singlePage/CastSection";
import Description from "@/components/singlePage/Description";
import SeasonsSection from "@/components/singleSeries/SeasonsSection";
import SinglePageLayout from "@/components/layout/singlePage/SinglePageLayout";
import SinglePageSkeleton from "@/components/layout/singlePage/SinglePageSkeleton";
import { fetchSingleSeries } from "@/services/SeriesService";

const SingleSeries = async ({ params }) => {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const seriesResponse = await fetchSingleSeries(slug);
    const seriesData = seriesResponse ? (seriesResponse.series ?? seriesResponse) : null;

    if (!seriesData || Object.keys(seriesData).length === 0) {
        return (
            <div className="container text-white text-center py-20">
                <h2 className="text-2xl">Série introuvable.</h2>
                <p>La série demandée n'existe pas ou est indisponible pour le moment.</p>
            </div>
        );
    }

    const { _id: id, title, description, actors } = seriesData;

    return (
        <Suspense fallback={<SinglePageSkeleton />}>
            <SinglePageLayout
                data={seriesData}
                type="series"
            >
                {/*//! Seasons List Section */}
                <SeasonsSection id={id} seriesTitle={title} />

                {/*//! Description Section */}
                <Description description={description} />

                {/*//! Cast Section */}
                <CastSection actors={actors} />

                {/*//! Previews Section */}
                <ReviewSection id={id} />
            </SinglePageLayout>
        </Suspense>
    );
}

export default SingleSeries;