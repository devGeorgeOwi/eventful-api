import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate } from '../../common/middleware/authenticate';
import { authorize } from '../../common/middleware/authorize';

const router = Router();

router.get('/events/:eventId', authenticate, authorize('CREATOR'), analyticsController.eventStats.bind(analyticsController));
router.get('/overall', authenticate, authorize('CREATOR'), analyticsController.overallStats.bind(analyticsController));

export { router as analyticsRoutes };