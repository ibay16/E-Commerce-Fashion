import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, categoryName, q, ids } = req.query;
      const data = await ProductService.getProducts({
        categoryId: categoryId as string,
        categoryName: categoryName as string,
        query: q as string,
        idsParam: ids as string
      });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProductService.getProductById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
