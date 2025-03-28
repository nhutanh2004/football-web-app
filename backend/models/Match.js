const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    team1: { type: String, ref: 'Team', required: true },
    team2: { type: String, ref: 'Team', required: true },
    score: { type: String },
    team1_scorer: [
        {
            scorerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
            minute: { type: Number, required: true },
            ownGoal: { type: Boolean, default: false }
        }
    ],
    team2_scorer: [
        {
            scorerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
            minute: { type: Number, required: true },
            ownGoal: { type: Boolean, default: false }
        }
    ],
    stadium: { type: String },
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed'], default: 'scheduled' }
});

module.exports = mongoose.model('Match', MatchSchema);
