const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

exports.index = (req, res) => res.json({ message: 'List with all Users' });

exports.createUserPost = [
  body('name', 'User name required').trim().isLength({ min: 3 }).escape(),
  body('email', 'User email required')
    .trim()
    .isEmail()
    .isLength({ min: 7 })
    .escape(),
  body('password', 'User password required')
    .trim()
    .isLength({ min: 8 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.findOne({ email: req.body.email })
      .exec()
      .then((found) => {
        if (found) {
          res.status(409).json({ error: 'email already taken' });
          throw new Error('email already taken');
        } else {
          return bcrypt.hash(req.body.password, 10);
        }
      })
      .then((hashedPassword) => {
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });

        return user.save();
      })
      .then((user) => {
        res.status(201).json({ user });
      })
      .catch((err) => next(err));
  },
];
