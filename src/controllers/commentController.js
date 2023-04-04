const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { Comment, Post } = require('../models');

exports.createCommentPost = [
  body('text', 'Comment text required').trim().isLength({ min: 10 }).escape(),
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = new Comment({
      text: req.body.text,
      author: req.body.author,
      post: new mongoose.mongo.ObjectId(req.body.post),
    });

    comment
      .save()
      .then((newComment) => res.status(201).json({ comment: newComment }))
      .catch((err) => next(err));
  },
];

exports.getPostComments = (req, res, next) => {
  Comment.find({ post: new mongoose.mongo.ObjectId(req.params.postId) })
    .exec()
    .then((comments) => {
      if (!comments) {
        return res.status(400).json({ message: 'no comments found' });
      }
      return res.status(200).json({ comments });
    })
    .catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
  Comment.findById(req.params.commentId)
    .exec()
    .then((comment) => {
      if (!comment) {
        return res.status(400).json({ message: 'diddnt found comment' });
      }
      const userId = new mongoose.mongo.ObjectId(req.user.id);
      return Post.findById(comment.post)
        .exec()
        .then((post) => {
          if (post.author.toString() !== userId.toString()) {
            return res
              .status(400)
              .json({ message: 'no rights to delete comment' });
          }
          return Comment.findByIdAndRemove(req.params.commentId);
        });
    })
    .then((deletedComment) => {
      if (!deletedComment) {
        return res.status(400).json({ message: 'cant delete comment' });
      }
      return res.status(204).json({ message: 'delete successful' });
    })
    .catch((err) => next(err));
};
