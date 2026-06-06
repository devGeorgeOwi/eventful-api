import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      details: err.errors,
    });
  }


};