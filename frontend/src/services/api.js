// Détecte si le code s'exécute côté serveur (Next.js SSR) ou côté client (navigateur)
const isServer = typeof window === "undefined";

export const API_BASE_URL = isServer
    ? "http://127.0.0.1:5000/api" // URL interne ultra-rapide pour le serveur Next.js
    : "https://scaling-space-funicular-g4pvv76jq6g52vw7p-5000.app.github.dev/api"; // URL publique pour ton navigateur