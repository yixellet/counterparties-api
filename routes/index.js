const router = require('express').Router();

const auth = require('../middlewares/auth');
const authRouter = require('./authentication');
const dataRouter = require('./data');

router.use('/users', authRouter);
router.use(auth);
router.use('/data', dataRouter);

module.exports = router;
