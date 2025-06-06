const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    comment: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', CommentSchema);