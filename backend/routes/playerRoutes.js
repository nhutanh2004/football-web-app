const express = require('express');
const playerController = require('../controllers/playerController');
const{authenticate, authorizeAdmin}=require('../middleware/authMiddleware')

const router = express.Router();

// Định nghĩa các routes cho Player
// Puplic route
router.get('/', playerController.getAllPlayers);
router.get('/team/:teamId', playerController.getPlayersByTeamId);
router.get('/:id', playerController.getPlayerById);

// Protected routes
router.post('/',authenticate,authorizeAdmin, playerController.createPlayer);
router.put('/:id',authenticate,authorizeAdmin, playerController.updatePlayer);
router.delete('/:id',authenticate,authorizeAdmin, playerController.deletePlayer);

module.exports = router;