const Router = require('koa-router');
const hotmartRouter = require('./routes/hotmart.router');

const router = new Router({
    prefix: '/api'
});

/*
    REQUESTS base_url/api/hotmart
*/
router.use('/hotmart', hotmartRouter.routes());

/*
    GET base_url/api
*/
router.get('/', async (ctx, next) => {
    console.log('Testing...');
});

module.exports = router;