const Match = require('../models/Match');

// Lấy tất cả trận đấu
exports.getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('team1 team2') // Populate team1 and team2
            .populate('team1_scorer.scorerId') // Populate team1_scorer details
            .populate('team2_scorer.scorerId'); // Populate team2_scorer details
        
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo trận đấu mới
exports.createMatch = async (req, res) => {
    const match = new Match(req.body);
    try {
        const newMatch = await match.save();
        res.status(201).json(newMatch);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Lấy thông tin trận đấu bằng ID
exports.getMatchById = async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate('team1 team2') // Populate team1 and team2
            .populate('team1_scorer.scorerId') // Populate team1_scorer details
            .populate('team2_scorer.scorerId'); // Populate team2_scorer details
            
        if (!match) return res.status(404).json({ message: 'Match not found' });
        res.json(match);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy tất cả trận đấu của một đội bóng
exports.getMatchesByTeamId = async (req, res) => {
    try {
        const matches = await Match.find({
            $or: [{ team1: req.params.teamId }, { team2: req.params.teamId }]
        })
            .populate('team1 team2') // Populate team1 and team2
            .populate('team1_scorer.scorerId') // Populate team1_scorer details 
            .populate('team2_scorer.scorerId'); // Populate team2_scorer details
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật thông tin trận đấu
exports.updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('team1 team2') // Populate team1 and team2
            .populate('team1_scorer.scorerId') // Populate team1_scorer details
            .populate('team2_scorer.scorerId'); // Populate team2_scorer details
        if (!match) return res.status(404).json({ message: 'Match not found' });
        res.json(match);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa trận đấu
exports.deleteMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndDelete(req.params.id);
        if (!match) return res.status(404).json({ message: 'Match not found' });
        res.json({ message: 'Match deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
