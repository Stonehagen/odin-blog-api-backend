const { Router } = require('express');
const commentController = require('../controllers/commentController');

const router = Router();

router.get('/', commentController.index);

module.exports = router;
