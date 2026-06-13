import { prisma } from '../db/client';
import midtransClient from 'midtrans-client';
import crypto from 'crypto';

const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ''
});

export class CheckoutService {
  static async initiateCharge(userId: string, body: any) {
    const { order_id, payment_type, bank, customer_details } = body;

    const order = await prisma.order.findUnique({
      where: { id: order_id, customerId: userId },
      include: { items: true }
    });

    if (!order) throw new Error('Order not found');
    if (order.status !== 'AWAITING_PAYMENT') throw new Error('Order is not awaiting payment');

    const productItems = order.items.map((item: any) => ({
      id: item.productId,
      price: Number(item.price),
      quantity: item.quantity,
      name: 'Product Item'
    }));

    const shippingFee = Number(order.shippingAmount) || 0;
    const itemsForMidtrans = [...productItems];
    
    if (shippingFee > 0) {
      itemsForMidtrans.push({ id: 'shipping-fee', price: shippingFee, quantity: 1, name: 'Biaya Pengiriman' });
    }

    const calculatedGrossAmount = itemsForMidtrans.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const customer = await prisma.customer.findUnique({
      where: { id: userId }
    });

    let midtransAddress = undefined;
    if (order.addressSnapshot) {
      try {
        const addr = typeof order.addressSnapshot === 'string' ? JSON.parse(order.addressSnapshot) : order.addressSnapshot;
        midtransAddress = {
          first_name: addr.recipient || customer?.name || customer_details?.first_name || 'Customer',
          phone: addr.phone || customer?.phone || '',
          address: addr.line1 || '',
          city: addr.city || '',
          postal_code: addr.postalCode || '',
          country_code: 'IDN'
        };
      } catch (e) {
        console.error("Failed to parse addressSnapshot", e);
      }
    }

    const parameter: any = {
      payment_type: payment_type || 'bank_transfer',
      transaction_details: { order_id, gross_amount: calculatedGrossAmount },
      customer_details: {
        first_name: customer?.name || customer_details?.first_name || 'Customer',
        email: customer?.email || customer_details?.email || 'customer@example.com',
        phone: customer?.phone || midtransAddress?.phone || '',
        billing_address: midtransAddress,
        shipping_address: midtransAddress,
      },
      item_details: itemsForMidtrans
    };

    if (payment_type === 'bank_transfer' && bank) {
      parameter.bank_transfer = { bank };
    } else if (payment_type === 'echannel') {
        parameter.echannel = { bill_info1: "Order Payment", bill_info2: order_id };
    }

    return await coreApi.charge(parameter);
  }

  static async handleWebhook(body: any) {
    const statusResponse = await coreApi.transaction.notification(body);
    const order_id = statusResponse.order_id;
    const transaction_status = statusResponse.transaction_status;

    let orderStatus: any = 'AWAITING_PAYMENT';
    if (['settlement', 'capture'].includes(transaction_status)) {
      orderStatus = 'PROCESSING';
    } else if (['expire', 'cancel', 'deny'].includes(transaction_status)) {
      orderStatus = 'CANCELLED';
    }

    if (orderStatus !== 'AWAITING_PAYMENT') {
      await prisma.order.updateMany({
        where: { id: order_id, status: 'AWAITING_PAYMENT' },
        data: { status: orderStatus }
      });
    }

    return { success: true };
  }

  static async getMidtransStatus(orderId: string) {
    const statusResponse = await coreApi.transaction.status(orderId);
    
    if (statusResponse && statusResponse.transaction_status) {
      const { transaction_status } = statusResponse;
      let orderStatus: any = 'AWAITING_PAYMENT';
      
      if (['settlement', 'capture'].includes(transaction_status)) {
        orderStatus = 'PROCESSING';
      } else if (['expire', 'cancel', 'deny'].includes(transaction_status)) {
        orderStatus = 'CANCELLED';
      }

      if (orderStatus !== 'AWAITING_PAYMENT') {
        await prisma.order.updateMany({
          where: { id: orderId, status: 'AWAITING_PAYMENT' },
          data: { status: orderStatus }
        });
      }
    }
    
    return statusResponse;
  }
}
