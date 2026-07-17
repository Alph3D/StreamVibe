// backend/model/seriesModel.js
const mongoose = require('mongoose');

const seriesModel = mongoose.Schema({
    // 🔥 _id ajouté pour les IDs TMDB
    _id: { 
        type: String, 
        required: true 
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    // 🔥 Director rendu optionnel pour TMDB
    director: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Directors",
        default: null
    },
    description: {
        type: String,
        default: "",
    },
    // 🔥 release_date rendu optionnel
    release_date: {
        type: String,
        default: ""
    },
    seasons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seasons'
    }],
    // 🔥 genres rendu plus flexible
    genres: {
        type: [String],
        default: ['Général']
    },
    category: {
        type: [String],
        default: ['Général']
    },
    country: {
        type: String,
        default: 'France'
    },
    language: {
        type: String,
        default: 'fr'
    },
    // 🔥 Champs optionnels pour TMDB
    production_company: {
        type: String,
        default: ''
    },
    age_rating: {
        type: String,
        default: 'Tous publics'
    },
    rotten_rating: {
        type: Number,
        default: 0
    },
    imdb_rating: {
        type: Number,
        default: 0
    },
    awards: [{
        name: {
            type: String,
            required: false
        },
        year: {
            type: Number,
            required: false
        }
    }],
    boxOffice: {
        budget: {
            type: Number,
        },
        gross: {
            type: Number,
        }
    },
    top250rank: {
        type: Number,
        required: false,
        min: 1,
        max: 250
    },
    pictures: {
        type: [String],
        required: false,
        default: []
    },
    thumbnail: {
        type: String,
        default: ''
    },
    cover: {
        type: String,
        default: ''
    },
    trailer: {
        type: String,
        default: ''
    },
    release_status: {
        type: String,
        enum: ['now showing', 'coming soon', 'expired'],
        default: 'now showing'
    },
    publish_date: {
        type: Date,
        default: Date.now
    },
    views: {
        type: Number,
        default: 0
    },
    actors: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "Actors"
    },
    // 🔥 Nouveaux champs pour TMDB
    original_language: {
        type: String,
        default: 'en'
    },
    original_title: {
        type: String,
        default: ''
    },
    poster_path: {
        type: String,
        default: ''
    },
    backdrop_path: {
        type: String,
        default: ''
    },
    vote_average: {
        type: Number,
        default: 0
    },
    vote_count: {
        type: Number,
        default: 0
    },
    popularity: {
        type: Number,
        default: 0
    },
    first_air_date: {
        type: String,
        default: ''
    }
}, {
    collection: 'series',
    timestamps: true
});

module.exports = mongoose.model('Series', seriesModel);