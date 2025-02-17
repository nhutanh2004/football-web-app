const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

// Định nghĩa các routes cho Match
router.get('/', matchController.getAllMatches);
router.post('/', matchController.createMatch);
router.get('/:id', matchController.getMatchById);
router.put('/:id', matchController.updateMatch);
router.delete('/:id', matchController.deleteMatch);

module.exports = router;