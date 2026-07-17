// frontend/app/series/[slug]/[season]/[episode]/page.jsx
import { fetchSingleSeries, fetchSingleEpisode } from "@/services/SeriesService";
import { notFound } from 'next/navigation';

export default async function SingleEpisodePage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const season = resolvedParams.season;
    const episode = resolvedParams.episode;

    // 🔥 SÉCURITÉ : Bloquer les fichiers d'images et icônes
    // Empêche Next.js de traiter les favicons et images comme des épisodes
    if (
        !slug || 
        slug === 'undefined' || 
        slug === 'null' ||
        season === 'images' || 
        season === 'assets' ||
        season === 'public' ||
        episode.includes('.png') || 
        episode.includes('.ico') || 
        episode.includes('.jpg') || 
        episode.includes('.jpeg') || 
        episode.includes('.svg') || 
        episode.includes('.webp') ||
        episode.includes('.json')
    ) {
        console.log(`⛔ Requête invalide ignorée - Slug: ${slug}, Season: ${season}, Episode: ${episode}`);
        return null; // Retourner null pour ignorer la requête
    }

    // 🔥 Vérifier que season et episode sont des nombres
    const seasonNum = parseInt(season);
    const episodeNum = parseInt(episode);
    
    if (isNaN(seasonNum) || isNaN(episodeNum) || seasonNum < 1 || episodeNum < 1) {
        console.log(`⛔ Saison/Épisode invalide - Season: ${season}, Episode: ${episode}`);
        notFound();
    }

    console.log(`📺 Slug: ${slug}, Season: ${seasonNum}, Episode: ${episodeNum}`);

    // 🔥 1. Récupérer la série pour obtenir l'ID numérique
    const seriesData = await fetchSingleSeries(slug);
    const series = seriesData?.series || seriesData;

    if (!series) {
        console.log('❌ Série non trouvée:', slug);
        notFound();
    }

    // 🔥 2. Extraire l'ID numérique (TMDB ID)
    const seriesId = series.tmdbId || series._id || series.id;
    console.log(`🎬 Series ID: ${seriesId}`);

    if (!seriesId) {
        console.log('❌ ID de série invalide');
        notFound();
    }

    // 🔥 3. Récupérer l'épisode avec l'ID numérique
    let episodeData;
    try {
        episodeData = await fetchSingleEpisode(seriesId, seasonNum, episodeNum);
    } catch (error) {
        console.error('❌ Erreur fetchSingleEpisode:', error);
        episodeData = null;
    }

    if (!episodeData) {
        console.log('❌ Épisode non trouvé:', seasonNum, episodeNum);
        notFound();
    }

    // 🔥 4. Rediriger vers la page watch avec les bons paramètres
    const { redirect } = await import('next/navigation');
    redirect(`/series/${slug}/watch?season=${seasonNum}&episode=${episodeNum}`);
}