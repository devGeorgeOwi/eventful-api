import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';

export class AnalyticsController {
  async eventStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.forEvent(req.params.eventId as string, req.user!.id);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }

  async overallStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.overall(req.user!.id);
      res.status(200).json({ status: 'success', data });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();