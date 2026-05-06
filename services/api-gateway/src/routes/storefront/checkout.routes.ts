import { Router } from 'express';
import { customerProxy } from '../../proxies/admin.proxy';
import { authenticateJWT } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { CreateOrderSchema, InitiateChargeSchema } from '@novure/contracts';

const router = Router();

// 1. Core Checkout (Create Order)
router.post('/', authenticateJWT, validate(CreateOrderSchema), customerProxy);

// 2. Midtrans Integration
router.post('/midtrans', authenticateJWT, validate(InitiateChargeSchema), customerProxy);
router.get('/midtrans/status', customerProxy);
router.post('/midtrans/notification', customerProxy);

// 3. Fallback for Orders (if reused)
router.get('/', authenticateJWT, customerProxy);
router.get('/:id', authenticateJWT, customerProxy);

export default router;
