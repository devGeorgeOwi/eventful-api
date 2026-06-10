import { Router } from 'express';
import { notificationsController } from './notifications.controller';
import { authenticate } from '../../common/middleware/authenticate';

const router = Router();

// Creator sets a reminder for the whole event
router.post(
  '/events/:eventId/reminders',
  authenticate,
  notificationsController.setEventReminder.bind(notificationsController)
);

// Attendee sets a personal reminder
router.post(
  '/events/:eventId/reminders/mine',
  authenticate,
  notificationsController.setUserReminder.bind(notificationsController)
);

export { router as notificationsRoutes };