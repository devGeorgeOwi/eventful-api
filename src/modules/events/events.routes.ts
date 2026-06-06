import { Router } from 'express';
import { eventsController } from './events.controller';
import { authenticate } from '../../common/middleware/authenticate';
import { authorize } from '../../common/middleware/authorize';

const router = Router();

// Public routes (still need auth to know who is buying, but listing is public for now)
router.get('/', eventsController.findAll.bind(eventsController));
router.get('/:id', eventsController.findById.bind(eventsController));

// Creator-only routes
router.post('/', authenticate, authorize('CREATOR'), eventsController.create.bind(eventsController));
router.put('/:id', authenticate, authorize('CREATOR'), eventsController.update.bind(eventsController));
router.delete('/:id', authenticate, authorize('CREATOR'), eventsController.delete.bind(eventsController));

export { router as eventsRoutes };