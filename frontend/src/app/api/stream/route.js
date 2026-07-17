// src/app/api/stream/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get('tmdbId');
  const type = searchParams.get('type') || 'movie'; // 'movie' ou 'tv'
  const season = searchParams.get('season') || '1';
  const episode = searchParams.get('episode') || '1';

  if (!tmdbId) {
    return NextResponse.json({ success: false, error: "ID TMDB manquant" }, { status: 400 });
  }

  try {
    // ÉTAPE ULTRA-SÉCURISÉE : Plus aucun fetch vers l'extérieur n'est fait ici.
    // On assemble directement les lecteurs de streaming les plus puissants du marché.
    
    // Lecteur Multi-Langues Premium (Artplayer) via des passerelles dynamiques
    const mainStreamUrl = type === 'movie'
      ? `https://vidsrc.me{tmdbId}`
      : `https://vidsrc.me{tmdbId}&sea=${season}&epi=${episode}`;

    // Adresses des lecteurs de secours configurées instantanément
    const backupUrls = [
      {
        name: "MultiEmbed (Lecteur VF)",
        url: type === 'movie' 
          ? `https://multiembed.mov{tmdbId}&tmdb=1&lang=fr`
          : `https://multiembed.mov{tmdbId}&tmdb=1&s=${season}&e=${episode}&lang=fr`,
        lang: "VF"
      },
      {
        name: "VidSrc.cc (Lecteur Multi/VO)",
        url: type === 'movie'
          ? `https://vidsrc.cc{tmdbId}?lang=fr`
          : `https://vidsrc.cc{tmdbId}/${season}/${episode}?lang=fr`,
        lang: "MULTI"
      }
    ];

    console.log(`✅ Flux sécurisé généré avec succès pour TMDB ID: ${tmdbId}`);

    return NextResponse.json({
      success: true,
      url: mainStreamUrl,
      title: `${type === 'movie' ? 'Film' : 'Série'} - ID: ${tmdbId} (S${season}E${episode})`,
      name: "Serveur Principal",
      backupUrls: backupUrls // Vos solutions de secours prêtes
    });

  } catch (error) {
    console.error(`⚠️ Échec de la génération : ${error.message}`);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
