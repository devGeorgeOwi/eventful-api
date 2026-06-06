import { Router } from 'express';
import { ticketsController } from './tickets.controller';
import { authenticate } from '../../common/middleware/authenticate';

const router = Router();

router.post('/purchase', authenticate, ticketsController.purchase.bind(ticketsController));
router.get('/verify-payment', ticketsController.verifyPayment.bind(ticketsController));  // public, called after Paystack redirect
router.post('/scan', authenticate, ticketsController.scanQr.bind(ticketsController));    // creator scans QR
router.get('/mine', authenticate, ticketsController.myTickets.bind(ticketsController));

export { router as ticketsRoutes };