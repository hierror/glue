import Router from 'koa-router';
import { purchaseCompleted } from '../controllers/hotmart/hotmart.controller.js';

const router = new Router();

router.post('/purchase/completed', purchaseCompleted);

export default router;