const { isValidObjectId } = require("mongoose");

module.exports = function (req, res, next) {
    const id = req.params.id;
    
    // Accept MongoDB ObjectIds or numeric TMDB IDs
    const isValidMongoId = isValidObjectId(id);
    const isValidTmdbId = /^\d+$/.test(id); // Numeric string (TMDB ID)
    
    if (!isValidMongoId && !isValidTmdbId) {
        return res.status(400).json({ status: 400, message: "Invalid ID" });
    }
    next();
};