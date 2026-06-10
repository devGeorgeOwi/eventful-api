import { Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service';
import { setReminderSchema } from './notifications.validation';

export class NotificationsController {
  async setEventReminder(req: Request, res: Response, next: NextFunction) {
    try {
      const { delta } = setReminderSchema.parse(req.body);
      const reminder = await notificationsService.setEventReminder(
        req.params.eventId as string,
        req.user!.id,
        delta
      );
      res.status(201).json({ status: 'success', data: reminder });
    } catch (err) {
      next(err);
    }
  }

  async setUserReminder(req: Request, res: Response, next: NextFunction) {
    try {
      const { delta } = setReminderSchema.parse(req.body);
      const reminder = await notificationsService.setUserReminder(
        req.params.eventId as string,
        req.user!.id,
        delta
      );
      res.status(201).json({ status: 'success', data: reminder });
    } catch (err) {
      next(err);
    }
  }
}

export const notificationsController = new NotificationsController();