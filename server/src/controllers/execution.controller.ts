import { Request, Response, NextFunction } from 'express';
import { ExecutionRepository } from '../repositories/execution.repository';
import { z } from 'zod';

const ExecutionQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const createExecutionController = () => {
  const getRecent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryResult = ExecutionQuerySchema.safeParse(req.query);
      if (!queryResult.success) {
        res.status(400).json({ error: 'Invalid query parameters', details: queryResult.error.format() });
        return;
      }

      const executions = await ExecutionRepository.findRecent(queryResult.data.limit);
      res.status(200).json({ executions });
    } catch (error) {
      next(error);
    }
  };

  return {
    getRecent,
  };
};
