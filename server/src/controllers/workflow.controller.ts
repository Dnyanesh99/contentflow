import { Request, Response, NextFunction } from 'express';
import { WorkflowRepository } from '../repositories/workflow.repository';
import { WorkflowSchema } from '../schemas/workflow.schema';
import { z } from 'zod';

const IdParamSchema = z.object({
  id: z.string().uuid('Invalid Workflow ID format'),
});

export const createWorkflowController = () => {
  const createOrUpdate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validationResult = WorkflowSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.format(),
        });
        return;
      }

      const { id, name, trigger_type, definition, is_active } = validationResult.data;
      const workflow = await WorkflowRepository.createOrUpdate(id, name, trigger_type, definition, is_active);
      
      res.status(201).json({
        message: 'Workflow saved successfully',
        workflow,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workflows = await WorkflowRepository.findAll();
      res.status(200).json({ workflows });
    } catch (error) {
      next(error);
    }
  };

  const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramResult = IdParamSchema.safeParse(req.params);
      if (!paramResult.success) {
        res.status(400).json({ error: 'Invalid ID format', details: paramResult.error.format() });
        return;
      }

      const id = paramResult.data.id;
      const workflow = await WorkflowRepository.findById(id);
      
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      
      res.status(200).json({ workflow });
    } catch (error) {
      next(error);
    }
  };

  const deleteWorkflow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramResult = IdParamSchema.safeParse(req.params);
      if (!paramResult.success) {
        res.status(400).json({ error: 'Invalid ID format', details: paramResult.error.format() });
        return;
      }

      const id = paramResult.data.id;
      const workflow = await WorkflowRepository.deleteById(id);
      
      if (!workflow) {
        res.status(404).json({ error: 'Workflow not found' });
        return;
      }
      
      res.status(200).json({
        message: 'Workflow deleted successfully',
        workflow,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    createOrUpdate,
    getAll,
    getById,
    delete: deleteWorkflow,
  };
};
