const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthday: { type: String},
    position: { type: String},
    team: { type: String, ref: 'Team', required: true },
    country: { type: String}, // New field for country
    number: { type: Number, required: true }, // New field for jersey number
    avatarUrl: { type: String } // New field for avatar URL
});

module.exports = mongoose.model('Player', PlayerSchema);