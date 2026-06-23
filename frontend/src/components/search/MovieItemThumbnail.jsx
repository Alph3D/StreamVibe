const MovieItemThumbnail = ({ src, title }) => {
    // Log pour débugger au cas où l'image ne s'affiche pas
    console.log("Source reçue dans Thumbnail :", src);

    // Vérifie si src existe et s'il s'agit déjà d'une URL complète (commence par http ou https)
    const isFullUrl = src && (src.startsWith("http://") || src.startsWith("https://"));
    
    // Si c'est une URL complète, on l'utilise directement. 
    // Sinon, on concatène avec ton URL de base.
    const finalSrc = isFullUrl ? src : `${process.env.NEXT_PUBLIC_IMAGE_URL}/${src}`;

    return (
        <img
            src={finalSrc}
            alt={title || "Movie thumbnail"}
            className="w-52 h-60 object-cover object-top rounded-xl border-2 border-c-black-15"
            onError={(e) => {
                console.error("Erreur chargement image :", finalSrc);
                // Utilise une image par défaut si le chargement échoue
                e.target.src = '/fallback-image.jpg'; 
            }}
        />
    );
}

export default MovieItemThumbnail;