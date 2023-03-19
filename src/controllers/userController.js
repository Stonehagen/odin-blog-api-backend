const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv/config');

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
  // eslint-disable-next-line consistent-return
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
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          return user.save();
        }
      })
      .then((user) => {
        res.status(201).json({ user });
      })
      .catch((err) => next(err));
  },
];

exports.logInUserPost = [
  body('email', 'User email required').trim().escape(),
  body('password', 'User password required').trim().escape(),
  // eslint-disable-next-line consistent-return
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    // eslint-disable-next-line consistent-return
    passport.authenticate('login', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          error: 'email or password invalid',
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }

        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
        return res.json({ user, token });
      });
    })(req, res);
  },
];
