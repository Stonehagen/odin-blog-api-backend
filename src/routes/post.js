const { Router } = require('express');
const passport = require('passport');
const postController = require('../controllers/postController');

require('../config/passport');

const router = Router();

router.get('/', postController.index);

router.get(
  '/all',
  passport.authenticate('jwt', { session: false }),
  postController.indexAll,
);

router.post(
  '/new',
  passport.authenticate('jwt', { session: false }),
  postController.createPostPost,
);

router.get('/latest/:limit', postController.getLatestPosts);

router.get('/:postId', postController.getPost);

router.put(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  postController.editPost,
);

router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  postController.deletePost,
);

module.exports = router;
