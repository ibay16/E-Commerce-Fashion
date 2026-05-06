import { prisma } from '../db/client';

const GATEWAY_URL = process.env.INTERNAL_API_URL || 'http://api-gateway:8000/api/storefront';
const INTERNAL_KEY = process.env.INTERNAL_SERVICE_KEY;

export class AccountService {
  private static async fetchProduct(productId: string) {
    try {
      const res = await fetch(`${GATEWAY_URL}/products/${productId}`, {
        headers: { 'x-internal-key': INTERNAL_KEY || '' }
      });
      if (!res.ok) return null;
      const json = await res.json() as any;
      return json.data;
    } catch (err) {
      console.error(`[AccountService] Error fetching product ${productId}:`, err);
      return null;
    }
  }

  static async getProfile(userId: string) {
    const customer = await prisma.customer.findUnique({
      where: { id: userId },
      include: { addresses: true, paymentMethods: true }
    });

    if (!customer) throw new Error('Pelanggan tidak ditemukan');

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    const mappedOrders = await Promise.all(orders.map(async (o) => {
      const primaryItem = o.items[0];
      let hydratedItem: any = primaryItem ? { ...primaryItem } : null;
      
      if (primaryItem) {
          const product = await this.fetchProduct(primaryItem.productId);
          if (product) {
            hydratedItem.name = product.name;
            hydratedItem.imageUrl = product.imageUrl || (product.image && product.image[0]) || (product.images && product.images[0]) || '/images/about/model1.png';
          } else {
            hydratedItem.name = 'Pesanan';
            hydratedItem.imageUrl = '/images/about/model1.png';
          }
          hydratedItem.unitPrice = Number(primaryItem.price);
      }

      return {
        ...o,
        total: Number(o.totalAmount),
        items: hydratedItem ? [hydratedItem, ...o.items.slice(1)] : []
      };
    }));

    return {
      phone: customer.phone,
      addresses: customer.addresses,
      paymentMethods: customer.paymentMethods.map(pm => ({
        ...pm,
        label: pm.provider
      })),
      orders: mappedOrders,
      wishlist: [], vouchers: [], notifications: []
    };
  }

  static async addAddress(userId: string, data: any) {
    return await prisma.address.create({ 
      data: { 
        line1: data.line1 || data.address || '',
        city: data.city || '',
        province: data.province || '',
        isPrimary: false, 
        customerId: userId 
      } 
    });
  }

  static async removeAddress(userId: string, addressId: string) {
    return await prisma.address.delete({
      where: { id: addressId, customerId: userId }
    });
  }
}
