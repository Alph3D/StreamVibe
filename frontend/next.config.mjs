/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    // 🔥 Variables d'environnement exposées au serveur Next.js
    env: {
        TMDB_API_KEY: process.env.TMDB_API_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'scaling-space-funicular-g4pvv76jq6g52vw7p-5000.app.github.dev',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'streamvibe-backend.liara.run',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;