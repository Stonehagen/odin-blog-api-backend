const { Router } = require('express');
const userController = require('../controllers/userController');

const router = Router();

router.get('/', userController.index);

router.post('/sign-up', userController.createUserPost);

module.exports = router;
