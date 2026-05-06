import { prisma } from '../db/client';
import type { OrderStatus } from '@novure/database';

export class OrderService {
  static async getOrders(status?: OrderStatus) {
    return await prisma.order.findMany({
      where: { status },
      include: {
        customer: { select: { name: true, email: true } },
        _count: { select: { items: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getOrderById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true, items: true }
    });
    if (!order) throw new Error('Pesanan tidak ditemukan');
    return order;
  }
}
