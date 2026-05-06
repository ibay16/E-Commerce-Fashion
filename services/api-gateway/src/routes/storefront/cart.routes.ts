import { Router } from 'express';
import { customerProxy } from '../../proxies/admin.proxy';
import { authenticateJWT } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import Joi from 'joi';

const router = Router();

// Minimal schema for cart mutations (could be moved to @novure/contracts)
const CartMutationSchema = Joi.object({
  productId: Joi.string().required(),
  productVariantId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).optional()
});

const CartUpdateSchema = Joi.object({
  itemId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

router.use(authenticateJWT);

router.get('/', customerProxy);
router.post('/', validate(CartMutationSchema), customerProxy);
router.put('/', validate(CartUpdateSchema), customerProxy);
router.delete('/:itemId', customerProxy);
router.patch('/', customerProxy);

export default router;
