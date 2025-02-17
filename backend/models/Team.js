const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    founded: { type: Number },
    stadium: { type: String },
    coach: { type: String },
});

module.exports = mongoose.model('Team', TeamSchema);