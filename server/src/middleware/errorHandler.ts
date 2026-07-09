import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error | ZodError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('[Global Error]', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      details: err.format(),
    });
    return;
  }

  const statusCode = err?.status || 500;
  const message = err?.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err?.stack }),
  });
};
