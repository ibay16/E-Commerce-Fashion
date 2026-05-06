import prisma from '../db/client';
import type { Prisma } from "@prisma/client";

export class ProductService {
  static async getProducts(params: { categoryId?: string, categoryName?: string, query?: string, idsParam?: string }) {
    const { categoryId, categoryName, query, idsParam } = params;

    let resolvedCategoryId = categoryId;

    if (categoryName && categoryName !== "all" && !resolvedCategoryId) {
      const mappedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      const category = await prisma.category.findFirst({
        where: { name: { mode: 'insensitive', equals: mappedName } },
        select: { id: true }
      });
      if (category) resolvedCategoryId = category.id;
      else return [];
    }

    const where: Prisma.ProductWhereInput = {};
    if (!idsParam) where.stock = { gt: 0 };
    if (idsParam) {
      const ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
      if (ids.length > 0) where.id = { in: ids };
    }
    if (resolvedCategoryId) where.categoryId = resolvedCategoryId;
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ];
    }

    return await prisma.product.findMany({
      where,
      include: { category: { select: { name: true } }, variants: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true }
    });
    if (!product) throw new Error('Produk tidak ditemukan');
    return product;
  }
}
