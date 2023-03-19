const { Router } = require('express');
const passport = require('passport');
const commentController = require('../controllers/commentController');

const router = Router();

router.post('/new', commentController.createCommentPost);

router.get('/post/:postId', commentController.getPostComments);

router.delete(
  '/:commentId',
  passport.authenticate('jwt', { session: false }),
  commentController.deleteComment,
);

module.exports = router;
