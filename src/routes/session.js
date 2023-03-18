const { Router } = require('express');

const router = Router();

// eslint-disable-next-line arrow-body-style
router.get('/', (req, res) => {
  return res.json({ message: 'Info About the Session' });
});

module.exports = router;
