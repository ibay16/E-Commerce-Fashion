import Joi from 'joi';

export const AddAddressSchema = Joi.object({
  label: Joi.string().default('Rumah'),
  recipient: Joi.string().required(),
  phone: Joi.string().required(),
  line1: Joi.string().required(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  postalCode: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional()
});

export const AddPaymentMethodSchema = Joi.object({
  label: Joi.string().required(),
  accountNumber: Joi.string().required(),
  accountName: Joi.string().required()
});

export const CreateOrderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    productId: Joi.string().required(),
    productVariantId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().required(),
    size: Joi.string().required()
  })).min(1).required(),
  total: Joi.number().min(0).required(),
  addressId: Joi.string().required(),
  shipping: Joi.number().min(0).optional(),
  courier: Joi.string().optional()
});

export const InitiateChargeSchema = Joi.object({
  order_id: Joi.string().required(),
  payment_type: Joi.string().required(),
  bank: Joi.string().optional(),
  customer_details: Joi.object({
    first_name: Joi.string().required(),
    email: Joi.string().email().required()
  }).required()
});
