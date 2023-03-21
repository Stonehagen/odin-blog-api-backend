const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 200 },
  text: { type: String, required: true, maxLength: 10000 },
  published: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

PostSchema.virtual('url').get(function getUrl() {
  // eslint-disable-next-line no-underscore-dangle
  return `/posts/${this._id}`;
});

module.exports = mongoose.model('Post', PostSchema);
