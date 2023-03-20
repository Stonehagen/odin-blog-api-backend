const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv/config');

const { User } = require('../models');

exports.createUserPost = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name be at least 2 chars long')
    .escape(),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide valid Email')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 chars long')
    .matches(/\d/)
    .withMessage('Password must contain a number')
    .escape(),
  // eslint-disable-next-line consistent-return
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    User.findOne({ email: req.body.email })
      .exec()
      .then((found) => {
        if (found) {
          return res.status(409).json({
            error: [
              {
                value: found.email,
                msg: 'Email already in use. Log in or use different email.',
                param: 'email',
                location: 'body',
              },
            ],
          });
        }
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        return user
          .save()
          .then(() => res.status(201).json({ message: 'user created' }));
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
