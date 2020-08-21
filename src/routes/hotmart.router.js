const Router = require('koa-router');
const { test } = require('../controllers/hotmart/hotmart.controller');

const router = new Router();

router.get('/', test);

module.exports = router;