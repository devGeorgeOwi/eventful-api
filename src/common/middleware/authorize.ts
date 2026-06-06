import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/app-error';

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new UnauthorizedError('You do not have permission to access this resource');
        }
        next();
    };
};