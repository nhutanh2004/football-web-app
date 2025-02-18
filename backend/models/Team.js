const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    founded: { type: Number, required: true },
    stadium: { type: String, required: true },
    coach: { type: String, required: true }
});

module.exports = mongoose.model('Team', TeamSchema);
