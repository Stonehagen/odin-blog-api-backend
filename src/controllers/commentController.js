const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { Comment } = require('../models');

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
      .then((newPost) => res.status(201).json({ newPost }))
      .catch((err) => next(err));
  },
];
