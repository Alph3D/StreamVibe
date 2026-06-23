const Movie = require('../model/movieModel');
const Series = require('../model/seriesModel');
const Actor = require('../model/actorModel');
const Director = require('../model/directorModel');

const searchController = async (req, res) => {
    const { query } = req.body;
    const limit = parseInt(req.query.limit) || 6;

    if (!query) {
        return res.status(400).json({ status: 400, message: "Query is required" });
    }

    try {
        console.log("🔍 Recherche active pour :", query);

        // Exécution des recherches en parallèle
        const [movies, series, actors, directors] = await Promise.all([
            Movie.find({ title: { $regex: query, $options: 'i' } }).limit(limit),
            Series.find({ title: { $regex: query, $options: 'i' } }).limit(limit),
            Actor.find({ fullName: { $regex: query, $options: 'i' } }).limit(limit),
            Director.find({ fullName: { $regex: query, $options: 'i' } }).limit(limit)
        ]);

        console.log(`✅ Résultats trouvés -> Films: ${movies.length}, Séries: ${series.length}, Acteurs: ${actors.length}, Réalisateurs: ${directors.length}`);

        const combinedResults = [
            ...movies.map(m => ({ type: 'movie', data: m })),
            ...series.map(s => ({ type: 'series', data: s })),
            ...actors.map(a => ({ type: 'actor', data: a })),
            ...directors.map(d => ({ type: 'director', data: d }))
        ];

        res.status(200).json({
            status: 200,
            message: "Search results fetched successfully",
            results: combinedResults.slice(0, limit)
        });
    } catch (error) {
        console.error("❌ Erreur dans le contrôleur de recherche :", error);
        res.status(500).send({ status: 500, message: "Internal Server Error" });
    }
};

module.exports = searchController;