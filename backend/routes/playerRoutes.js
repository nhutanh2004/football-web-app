const express = require('express');
const playerController = require('../controllers/playerController');

const router = express.Router();

// Định nghĩa các routes cho Player
router.get('/', playerController.getAllPlayers);
router.post('/', playerController.createPlayer);
router.get('/team/:teamId', playerController.getPlayersByTeamId);
router.get('/name/:name', playerController.getPlayerByName); // New route to get player by name
router.get('/:id', playerController.getPlayerById);
router.put('/:id', playerController.updatePlayer);
router.delete('/:id', playerController.deletePlayer);

module.exports = router;