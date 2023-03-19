const { Router } = require('express');
const commentController = require('../controllers/commentController');

const router = Router();

router.post('/new', commentController.createCommentPost);

module.exports = router;
