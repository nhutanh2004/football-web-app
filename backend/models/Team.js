const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    _id: { type:String, required: true },
    name: { type: String, required: true },
    founded: { type: Number},
    stadium: { type: String},
    coach: { type: String},
    logo_high: { type: String},
    logo_low: { type: String,},
    total_player: { type: Number}
});

module.exports = mongoose.model('Team', TeamSchema);
