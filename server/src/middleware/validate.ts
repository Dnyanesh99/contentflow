import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Generic Express middleware to validate req.body against a provided Zod schema.
 * Returns strict 400 JSON on validation failure.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parseResult = schema.safeParse(req.body);
    
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Validation Error',
        details: parseResult.error.format(),
      });
      return;
    }
    
    req.body = parseResult.data;
    next();
  };
};
