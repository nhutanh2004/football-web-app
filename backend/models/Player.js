const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number },
    position: { type: String },
    team: { type: String, ref: 'Team' },
});

module.exports = mongoose.model('Player', PlayerSchema);