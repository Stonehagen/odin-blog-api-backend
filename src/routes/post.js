const { Router } = require('express');
const passport = require('passport');
const postController = require('../controllers/postController');

require('../passport');

const router = Router();

router.get('/', postController.index);

router.post(
  '/new',
  passport.authenticate('jwt', { session: false }),
  postController.createPostPost,
);

router.get('/:postId', postController.getPost);

router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  postController.deletePost,
);

module.exports = router;
