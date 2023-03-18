const { Router } = require('express');
const sessionController = require('../controllers/sessionController');

const router = Router();

router.get('/', sessionController.index);

module.exports = router;
