// Utilise des composants dédiés aux séries
import GenresSection from "../explore/series/GenresSection"; // Assure-toi que ce dossier existe
import PopularSeriesSection from "../explore/series/PopularSeriesSection";
import TrendingSeriesSection from "../explore/series/TrendingSection";
import TopSeriesSection from "../explore/series/TopSeriesSection";

const SeriesPage = () => {
    return (
        <main className="container md:pt-16 pt-5 md:pb-20 pb-10 space-y-16">
            <GenresSection />
            <TopSeriesSection />
            <TrendingSeriesSection />
            <PopularSeriesSection />
        </main>
    );
}

export default SeriesPage;