const { Router } = require('express');
const passport = require('passport');
const postController = require('../controllers/postController');

require('../passport');

const router = Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  postController.index,
);

module.exports = router;
