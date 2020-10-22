import Router from 'koa-router';
import HotmartRouter from './routes/hotmart.router.js';
import { HotmartAuth } from './helpers/auth.js'

const router = new Router({
    prefix: '/api'
});

/*
    REQUESTS base_url/api/hotmart
*/
router.use('/hotmart', HotmartAuth, HotmartRouter.routes());

/*
    GET base_url/api
*/
router.get('/', async (ctx, next) => {
    console.log('Testing...');

    ctx.status = 200;
    ctx.body = {
        status: 'success',
        message: 'Testing the API',
        payload: null
    };
});

export default router;