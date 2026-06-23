const express = require('express');
const dotEnv = require('dotenv');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDb = require('./config/db');

//! Config Env - CORRIGÉ avec un chemin absolu pour éviter le bug "undefined"
dotEnv.config({ path: path.resolve(__dirname, 'config', 'config.env') });

//! Connect to Database
connectDb();

const app = express();

//! cors options - Configuration dynamique et robuste pour le développement et la production
app.use(cors({
    origin: function (origin, callback) {
        // Autorise la requête si elle n'a pas d'origine (comme les outils Postman, mobile ou SSR)
        // ou si elle provient de n'importe quel domaine de dev ou prod
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Cookie"]
}));

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

app.listen(process.env.PORT || 5000, err => {
    if (err) return console.log(err);
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});