import { Request, Response, NextFunction } from 'express';
import { ticketsService } from './tickets.service';
import { purchaseSchema } from './tickets.validation';
import { BadRequestError } from '../../common/errors/app-error';

export class TicketsController {
  async purchase(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = purchaseSchema.parse(req.body);
      const result = await ticketsService.purchase(req.user!.id, eventId);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { reference } = req.query;
      if (!reference) throw new BadRequestError('Reference required');
      const ticket = await ticketsService.verifyAndCreateTicket(reference as string);
      res.status(200).json({ status: 'success', data: ticket });
    } catch (err) {
      next(err);
    }
  }

  async scanQr(req: Request, res: Response, next: NextFunction) {
    try {
      const { qrCodeText } = req.body;
      if (!qrCodeText) throw new BadRequestError('QR code text required');
      const result = await ticketsService.verifyQrCode(qrCodeText, req.user!.id);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  async myTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await ticketsService.getUserTickets(req.user!.id);
      res.status(200).json({ status: 'success', data: tickets });
    } catch (err) {
      next(err);
    }
  }
}

export const ticketsController = new TicketsController();