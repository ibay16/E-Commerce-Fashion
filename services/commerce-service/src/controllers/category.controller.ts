import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.getCategories();
      res.json({ success: true, ...result });
    } catch(e) { next(e); }
  }
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.createCategory(req.body);
      res.json({ success: true, ...result });
    } catch(e) { next(e); }
  }
  static async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.getCategoryById(req.params.id as string);
      res.json({ success: true, ...result });
    } catch(e) { next(e); }
  }
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.updateCategory(req.params.id as string, req.body);
      res.json({ success: true, ...result });
    } catch(e) { next(e); }
  }
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.deleteCategory(req.params.id as string);
      res.json({ success: true, ...result });
    } catch(e) { next(e); }
  }
}
