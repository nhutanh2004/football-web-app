const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    team1: { type: String, ref: 'Team' , require: true},
    team2: { type: String, ref: 'Team' , require: true},
    score: { type: String },
    scorer: [{ type: String, ref: 'Player' }],
    stadium: { type: String},
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' },
});

module.exports = mongoose.model('Match', MatchSchema);