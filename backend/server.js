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

//! cors options - AJOUT de ton URL GitHub Codespaces
const corsOptions = {
    origin: [
        "http://localhost:3000", 
        "https://streamvibe-live.liara.run",
        "https://scaling-space-funicular-g4pvv76jq6g52vw7p-3000.app.github.dev" // Ton frontend actuel
    ],
    credentials: true,
};

const app = express()
    .use(express.json())
    // Si tu veux être 100% tranquille sur Codespaces, tu peux remplacer cors(corsOptions) par cors() tout court pendant le dev
    .use(cors(corsOptions)) 
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser());


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