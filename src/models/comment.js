const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 1000 },
  author: { type: String, required: true, maxLength: 30 },
  timestamp: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
});

module.exports = mongoose.model('Comment', CommentSchema);
