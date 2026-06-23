import { Suspense } from "react";

import ReviewSection from "@/components/review/ReviewSection";
import CastSection from "@/components/singlePage/CastSection";
import Description from "@/components/singlePage/Description";
import SeasonsSection from "@/components/singleSeries/SeasonsSection";
import SinglePageLayout from "@/components/layout/singlePage/SinglePageLayout";
import SinglePageSkeleton from "@/components/layout/singlePage/SinglePageSkeleton";
import { notFound } from "next/navigation";

const fetchSingleSeries = async (slug) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/series/${slug}`);

    if (!res.ok) {
        if (res.status === 404) return notFound();
        console.error('fetchSingleSeries: network response not ok', res.status, res.statusText);
        return null;
    }

    const text = await res.text();
    if (!text) return null;

    try {
        const data = JSON.parse(text);
        if (data?.status === 404) return notFound();
        return data;
    } catch (err) {
        console.error('fetchSingleSeries: failed to parse JSON', err);
        return null;
    }
}

const SingleSeries = async ({ params }) => {
    const { slug } = params;

    const seriesResponse = await fetchSingleSeries(slug);
    const seriesData = seriesResponse ? (seriesResponse.series ?? seriesResponse) : null;
    const pictures = seriesResponse ? (seriesResponse.pictures ?? []) : [];

    if (!seriesData) return <SinglePageSkeleton />;

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