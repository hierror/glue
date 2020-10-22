import Router from 'koa-router';
import { purchaseApproved, purchaseCompleted } from '../controllers/hotmart/hotmart.controller.js';

const router = new Router();

router.post('/purchase/approved', purchaseApproved);

router.post('/purchase/completed', purchaseCompleted);

export default router;