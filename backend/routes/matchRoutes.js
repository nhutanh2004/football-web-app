const express = require('express');
const matchController = require('../controllers/matchController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Định nghĩa các routes cho Match

//Puplic route
router.get('/', matchController.getAllMatches);
router.get('/:id', matchController.getMatchById);
router.get('/team/:teamId', matchController.getMatchesByTeamId);

//Proteted routes
router.post('/',authenticate,authorizeAdmin, matchController.createMatch);
router.put('/:id',authenticate,authorizeAdmin, matchController.updateMatch);
router.delete('/:id',authenticate,authorizeAdmin, matchController.deleteMatch);

module.exports = router;