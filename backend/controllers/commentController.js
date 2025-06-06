const Comment = require('../models/Comment');

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    const newComment = new Comment({
      user: req.user.id,
      comment,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: 'Error creating comment', error: err.message });
  }
};

// Delete a comment (only the owner or admin)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Only the owner or admin can delete
    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};

// Edit a comment (only the owner)
exports.editComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const commentDoc = await Comment.findById(req.params.id);
    if (!commentDoc) return res.status(404).json({ message: 'Comment not found' });

    // Only the owner can edit
    if (commentDoc.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    commentDoc.comment = comment || commentDoc.comment;
    await commentDoc.save();
    res.json(commentDoc);
  } catch (err) {
    res.status(500).json({ message: 'Error editing comment', error: err.message });
  }
};

// Get all comments (with user info)
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'username email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};

// Get all comments of a specific user
exports.getCommentsByUser = async (req, res) => {
  try {
    const comments = await Comment.find({ user: req.params.userId }).populate('user', 'username email');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user comments', error: err.message });
  }
};