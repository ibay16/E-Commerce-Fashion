import { Request, Response, NextFunction } from 'express';
import { ShippingService } from '../services/shipping.service.js';

export class ShippingController {
  static async getCarriers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ShippingService.getCarriers();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const data = await ShippingService.getTracking(orderId);
      if (!data) return res.status(404).json({ success: false, error: 'Tracking not found' });
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async createTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ShippingService.createTracking(req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async addLog(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ShippingService.addLog(req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}
