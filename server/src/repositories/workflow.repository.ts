import { pool } from '../db/pool';
import { Workflow } from '../schemas/workflow.schema';

export class WorkflowRepository {
  static async createOrUpdate(id: string, name: string, trigger_type: string, definition: any, is_active: boolean): Promise<Workflow> {
    const query = `
      INSERT INTO workflows (id, name, trigger_type, definition, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        trigger_type = EXCLUDED.trigger_type,
        definition = EXCLUDED.definition,
        is_active = EXCLUDED.is_active
      RETURNING *;
    `;
    const values = [id, name, trigger_type, JSON.stringify(definition), is_active];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(): Promise<Workflow[]> {
    const result = await pool.query('SELECT * FROM workflows ORDER BY name ASC');
    return result.rows;
  }

  static async findById(id: string): Promise<Workflow | null> {
    const result = await pool.query('SELECT * FROM workflows WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async deleteById(id: string): Promise<Workflow | null> {
    const result = await pool.query('DELETE FROM workflows WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }

  static async findByTriggerType(triggerType: string): Promise<Pick<Workflow, 'id' | 'definition'>[]> {
    const query = `
      SELECT id, definition 
      FROM workflows 
      WHERE trigger_type = $1 AND is_active = true
    `;
    const result = await pool.query(query, [triggerType]);
    return result.rows;
  }
}
