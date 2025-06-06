const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate } = require('../middleware/authMiddleware');

// Create a new comment (user must be logged in)
router.post('/', authenticate, commentController.createComment);

// Get all comments (public)
router.get('/', commentController.getAllComments);

// Edit a comment (only owner)
router.put('/:id', authenticate, commentController.editComment);

// Delete a comment (only owner or admin)
router.delete('/:id', authenticate, commentController.deleteComment);

// Get all comments of a specific user (public)
router.get('/user/:userId', commentController.getCommentsByUser);

module.exports = router;