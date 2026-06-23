import TopHeader from "@/components/singlePage/TopHeader";
import Sidebar from "./Sidebar";
import SubscriptionBox from "@/components/subscription/SubscriptionBox";

const SinglePageLayout = ({ children, data, type }) => {
    // 1. Protection contre data null
    if (!data) return <div className="text-white p-10 text-center">Chargement des données...</div>;

    // 2. Déstructuration sécurisée
    const { 
        _id: id, 
        title = "Titre inconnu", 
        description = "", 
        cover, 
        thumbnail, 
        poster, 
        language, 
        genres, 
        director, 
        release_date, 
        imdb_rating, 
        rotten_rating 
    } = data;

    const imageToUse = thumbnail || poster;

    return (
        <main className="container mx-auto px-4 py-6">
            <TopHeader 
                id={id} 
                title={title} 
                description={description} 
                cover={cover} 
                thumbnail={imageToUse} 
            />

            {/* Suppression de 'min-h-screen' pour éviter l'écran gris infini */}
            <section className="grid grid-cols-12 xl:gap-8 lg:gap-4 gap-6 xl:mt-24 md:mt-16 mt-10 mb-12">
                <article className="lg:col-span-8 col-span-12 space-y-6 max-lg:order-2">
                    {children ? children : <p className="text-white">Aucun contenu disponible.</p>}
                </article>

                <Sidebar
                    releaseDate={release_date}
                    language={language}
                    rating={[
                        { source: 'IMDb', score: imdb_rating || "N/A" }, 
                        { source: 'Rotten Tomatoes', score: rotten_rating || "N/A" }
                    ]}
                    director={director}
                    genres={genres}
                    type={type}
                />
            </section>

            <SubscriptionBox />
        </main>
    );
}

export default SinglePageLayout;