/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        // Remplacement de domains (déprécié) par remotePatterns pour la sécurité
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
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