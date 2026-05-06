import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/storefront/checkout/midtrans/status?orderId=...
router.get('/midtrans/status', CheckoutController.getMidtransStatus);

// POST /api/storefront/checkout/midtrans - Initiate charge
router.post('/midtrans', authenticateJWT, CheckoutController.initiateCharge);

// POST /api/storefront/checkout/midtrans/notification - Webhook
router.post('/midtrans/notification', CheckoutController.handleWebhook);

export default router;
