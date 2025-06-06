const express = require('express');
const teamController = require('../controllers/teamController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

//Public routes
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);

//Proteted routes
router.post('/',authenticate,authorizeAdmin, teamController.createTeam);
router.delete('/:id',authenticate,authorizeAdmin, teamController.deleteTeam);
router.put('/:id',authenticate,authorizeAdmin, teamController.updateTeam);

module.exports = router;