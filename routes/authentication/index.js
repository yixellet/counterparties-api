const { createUser, login } = require('../../controllers/authentication');

const router = require('express').Router();

router.post('/signup', createUser);
router.post('/signin', login);

module.exports = router;
