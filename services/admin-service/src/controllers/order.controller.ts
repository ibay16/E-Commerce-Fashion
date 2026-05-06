import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '@novure/database';

export class OrderController {
  static async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const data = await OrderService.getOrders(status as OrderStatus);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await OrderService.getOrderById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
