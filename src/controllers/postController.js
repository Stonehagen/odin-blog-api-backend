const { body, validationResult } = require('express-validator');

const { Post } = require('../models');

exports.index = (req, res, next) => {
  Post.find({})
    .exec()
    .then((posts) => res.status(200).json({ posts }))
    .catch((err) => next(err));
};

exports.createPostPost = [
  body('title', 'Post title required').trim().isLength({ min: 3 }).escape(),
  body('text', 'post text required').trim().isLength({ min: 20 }).escape(),
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = new Post({
      title: req.body.title,
      text: req.body.text,
      author: req.user.id,
    });

    post
      .save()
      .then((newPost) => res.status(201).json({ newPost }))
      .catch((err) => next(err));
  },
];

exports.getPost = (req, res, next) => {
  Post.findById(req.params.postId)
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(400).json({ message: 'Post not found' });
      }
      return res.status(200).json({ post });
    })
    .catch((err) => next(err));
};
