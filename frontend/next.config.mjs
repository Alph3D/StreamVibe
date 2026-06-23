/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        //remotePatterns indique à Next.js quelles URLs externes sont autorisées
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'image.tmdb.org', // <-- C'est cette ligne qui débloque les images TMDB
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'scaling-space-funicular-g4pvv76jq6g52vw7p-5000.app.github.dev', // Ton backend Codespaces
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'streamvibe-backend.liara.run', // Ton backend en production
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;