const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    score: { type: String },
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' },
});

module.exports = mongoose.model('Match', MatchSchema);