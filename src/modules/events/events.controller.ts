import { Request, Response, NextFunction } from 'express';
import { eventsService } from './events.service';
import { createEventSchema, updateEventSchema, eventQuerySchema } from './events.validation';

export class EventsController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = createEventSchema.parse(req.body);
            const event = await eventsService.create(req.user!.id, data);
            res.status(201).json({ status: 'success', data: event });
        } catch (error) {
            next(error);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = eventQuerySchema.parse(req.query);
            const result = await eventsService.findAll(query);
            res.status(200).json({ status: 'success', ...result });
        } catch (error) {
            next(error);
        }
    }
    
    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const event = await eventsService.findById(req.params.id as string);
            res.status(200).json({ status: 'success', data: event });
        } catch (error) {
            next(error);
        }
    }

    // Update and delete can be implemented similarly, with appropriate validation and service calls
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = updateEventSchema.parse(req.body);
            const event = await eventsService.update(req.params.id as string, req.user!.id, data);
            res.status(200).json({ status: 'success', data: event });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await eventsService.delete(req.params.id as string, req.user!.id);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const eventsController = new EventsController();