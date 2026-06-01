import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = registerSchema.parse(req.body);
      const tokens = await authService.register(email, password, role);
      res.status(201).json({ status: 'success', data: tokens });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const tokens = await authService.login(email, password);
      res.status(200).json({ status: 'success', data: tokens });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ status: 'error', message: 'Refresh token required' });
      }
      const tokens = await authService.refreshAccessToken(refreshToken);
      res.status(200).json({ status: 'success', data: tokens });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();