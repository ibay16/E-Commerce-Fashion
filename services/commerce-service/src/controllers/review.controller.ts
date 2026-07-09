import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';

export class ReviewController {
  static async submitReview(req: any, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.submitReview({ customerId: req.user.id, ...req.body });
      res.json({ success: true, data: result });
    } catch(e) { next(e); }
  }
  static async getReviewsByProductId(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ReviewService.getReviewsByProductId(req.params.id as string);
      res.json({ success: true, data: result });
    } catch(e) { next(e); }
  }
}
