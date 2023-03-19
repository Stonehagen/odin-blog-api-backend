const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const { Post } = require('../models');

exports.index = (req, res, next) => {
  Post.find({ published: true })
    .exec()
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({ message: 'no posts found' });
      }
      return res.status(200).json({ posts });
    })
    .catch((err) => next(err));
};

exports.indexAll = (req, res, next) => {
  Post.find()
    .exec()
    .then((posts) => {
      if (!posts) {
        return res.status(404).json({ message: 'no posts found' });
      }
      return res.status(200).json({ posts });
    })
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
      published: req.body.published,
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

exports.deletePost = (req, res, next) => {
  Post.findById(req.params.postId)
    .exec()
    .then((post) => {
      if (!post) {
        return res.status(400).json({ message: 'diddnt found post' });
      }
      const userId = new mongoose.mongo.ObjectId(req.user.id);
      if (post.author.toString() !== userId.toString()) {
        return res.status(400).json({ message: 'not author of the post' });
      }
      return Post.findByIdAndRemove(req.params.postId);
    })
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(400).json({ message: 'cant delete post' });
      }
      return res.status(204).json({ message: 'delete post successful' });
    })
    .catch((err) => next(err));
};

exports.editPost = [
  body('title', 'Post title required').trim().isLength({ min: 3 }).escape(),
  body('text', 'post text required').trim().isLength({ min: 20 }).escape(),
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = new Post({
      _id: new mongoose.mongo.ObjectId(req.params.postId),
      title: req.body.title,
      text: req.body.text,
      published: req.body.published,
      author: req.user.id,
    });

    Post.findById(req.params.postId)
      .exec()
      .then((foundPost) => {
        if (!foundPost) {
          return res.status(400).json({ message: 'diddnt found post' });
        }
        const userId = new mongoose.mongo.ObjectId(req.user.id);
        if (post.author.toString() !== userId.toString()) {
          return res.status(400).json({ message: 'not author of the post' });
        }
        return Post.findByIdAndUpdate(req.params.postId, post);
      })
      .then((updatedPost) => {
        if (!updatedPost) {
          return res.status(400).json({ message: 'cant update post' });
        }
        return res.status(201).json({ message: 'update post successful' });
      })
      .catch((err) => next(err));
  },
];
