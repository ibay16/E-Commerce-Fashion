import { prisma } from '../db/client';

const GATEWAY_URL = process.env.INTERNAL_API_URL || 'http://api-gateway:8000/api/storefront';
const INTERNAL_KEY = process.env.INTERNAL_SERVICE_KEY;

export class CartService {
  private static async fetchProducts(productIds: string[]) {
    if (productIds.length === 0) return [];
    try {
      const idsParam = productIds.join(',');
      const res = await fetch(`${GATEWAY_URL}/products?ids=${idsParam}`, {
        headers: { 'x-internal-key': INTERNAL_KEY || '' }
      });
      if (!res.ok) return [];
      const json = await res.json() as any;
      return (json.data || []).map((d: any) => ({ ...d, price: Number(d.price) }));
    } catch (err) {
      console.error(`[CartService] Error fetching products:`, err);
      return [];
    }
  }

  private static async hydrateItems(items: any[]) {
    if (items.length === 0) return [];
    const productIds = Array.from(new Set(items.map(item => item.productId)));
    const products = await this.fetchProducts(productIds);
    
    return items.map(item => {
      const product = products.find((p: any) => p.id === item.productId);
      const variant = product?.variants?.find((v: any) => v.id === item.productVariantId);
      return { ...item, product: product || null, variant };
    });
  }

  static async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { customerId: userId },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { customerId: userId },
        include: { items: true },
      });
    }

    const hydratedItems = await this.hydrateItems(cart.items);
    return { ...cart, items: hydratedItems };
  }

  static async addItem(userId: string, data: { productId: string, productVariantId: string, quantity?: number }) {
    const { productId, productVariantId, quantity = 1 } = data;
    
    let cart = await prisma.cart.findUnique({ where: { customerId: userId } });
    if (!cart) cart = await prisma.cart.create({ data: { customerId: userId } });

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_productVariantId: { cartId: cart.id, productVariantId } }
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, productVariantId, quantity }
      });
    }

    return await this.getCart(userId);
  }
}
