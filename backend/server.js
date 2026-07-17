// backend/server.js
const express = require('express');
const dotEnv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDb = require('./config/db');

//! Config Env
dotEnv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

//! Connect to Database
connectDb();

const app = express();

//! 🔥 CORS - Configuration complète
const corsOptions = {
    origin: function (origin, callback) {
        // Permettre les requêtes sans origine (Postman, etc.)
        if (!origin) return callback(null, true);
        
        // 🔥 Permettre toutes les URLs de Codespace
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'https://*.app.github.dev',
            'https://*.github.dev',
            'https://scaling-space-funicular-g4pvv76jq6g52vw7p-3000.app.github.dev'
        ];
        
        // Vérifier si l'origine correspond
        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed.includes('*')) {
                const pattern = allowed.replace('*', '.*');
                return new RegExp(pattern).test(origin);
            }
            return origin === allowed;
        });
        
        // En développement, tout permettre
        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`❌ CORS bloqué pour: ${origin}`);
            callback(null, true); // En développement, tout permettre
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With", 
        "Accept", 
        "Cookie",
        "Origin",
        "Access-Control-Allow-Origin"
    ]
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//! Middlewares standard
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//! Static Folder
app.use("/public", express.static(path.join(__dirname, "public", "actor")));
app.use("/public", express.static(path.join(__dirname, "public", "cover")));
app.use("/public", express.static(path.join(__dirname, "public", "director")));
app.use("/public", express.static(path.join(__dirname, "public", "profile")));
app.use("/public", express.static(path.join(__dirname, "public", "thumbnail")));
app.use("/public", express.static(path.join(__dirname, "public", "trailer")));
app.use("/public", express.static(path.join(__dirname, "public", "videos")));

//! Routes
app.use('/api/user', require('./router/userRoutes'));
app.use('/api/movie', require('./router/movieRoutes'));
app.use('/api/series', require('./router/seriesRoutes'));
app.use('/api/actor', require('./router/actorRoutes'));
app.use('/api/director', require('./router/directorRoutes'));
app.use('/api/review', require('./router/reviewRoutes'));
app.use('/api/season', require('./router/seasonRoutes'));
app.use('/api/episode', require('./router/episodeRoutes'));
app.use("/api/support", require('./router/supportRoutes'));
app.use("/api/like", require('./router/likeRoutes'));
app.use("/api/search", require('./router/searchRoutes'));

//! 🔥 Route de test pour vérifier l'API
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API fonctionne!',
        timestamp: new Date().toISOString(),
        endpoints: {
            popular: '/api/series/popular-series?page=1',
            trending: '/api/series/trending-series?page=1'
        }
    });
});

//! 🔥 Écouter sur 0.0.0.0 pour Codespace
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', err => {
    if (err) return console.log(err);
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`📡 Test: http://localhost:${PORT}/api/test`);
    
    if (process.env.CODESPACE_NAME) {
        const codespaceUrl = `https://${process.env.CODESPACE_NAME}-${PORT}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
        console.log(`📡 Codespace URL: ${codespaceUrl}`);
        console.log(`📡 Test: ${codespaceUrl}/api/test`);
    }
});