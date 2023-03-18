const { Router } = require('express');
const postController = require('../controllers/postController');

const router = Router();

router.get('/', postController.index);

module.exports = router;
