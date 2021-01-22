import Router from 'koa-router';
import { purchaseApproved, purchaseCompleted } from '../controllers/hotmart/hotmart.controller.js';
import { validator } from '../helpers/validator.js';

const router = new Router();

router.post('/purchase/approved', validator, purchaseApproved);

router.post('/purchase/completed', purchaseCompleted);

export default router;