const Player = require('../models/Player');

// Lấy tất cả cầu thủ
exports.getAllPlayers = async (req, res) => {
    try {
        const players = await Player.find().populate('team'); // Populate thông tin đội bóng
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo cầu thủ mới
exports.createPlayer = async (req, res) => {
    const player = new Player(req.body);
    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Lấy thông tin cầu thủ theo id đội bóng
exports.getPlayersByTeamId = async (req, res) => {
    try {
        const players = await Player.find({ team: req.params.teamId }).populate('team'); // Populate thông tin đội bóng
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Lấy thông tin cầu thủ bằng ID
exports.getPlayerById = async (req, res) => {
    try {
        const player = await Player.findById(req.params.id).populate('team'); // Populate thông tin đội bóng
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Lấy thông tin cầu thủ bằng tên
exports.getPlayerByName = async (req, res) => {
    try {
        const player = await Player.findOne({ name: req.params.name }).populate('team'); // Populate thông tin đội bóng
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) { 
        res.status(500).json({ message: err.message });
    }
}

// Cập nhật thông tin cầu thủ
exports.updatePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json(player);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa cầu thủ
exports.deletePlayer = async (req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id);
        if (!player) return res.status(404).json({ message: 'Player not found' });
        res.json({ message: 'Player deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};