const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    team1: { type: String, ref: 'Team' },
    team2: { type: String, ref: 'Team' },
    score: { type: String },
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' },
});

module.exports = mongoose.model('Match', MatchSchema);