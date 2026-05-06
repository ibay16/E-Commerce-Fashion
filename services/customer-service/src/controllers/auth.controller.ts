import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.getMe(req.user!.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}
