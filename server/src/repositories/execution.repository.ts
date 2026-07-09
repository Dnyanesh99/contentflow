import { pool } from '../db/pool';
import { ExecutionStatus, Execution } from '../schemas/execution.schema';

export type RecentExecution = Execution & { workflow_name: string };

export class ExecutionRepository {
  static async findRecent(limit: number = 50): Promise<RecentExecution[]> {
    const query = `
      SELECT e.id, e.workflow_id, e.correlation_id, e.status, e.logs, e.created_at, w.name as workflow_name
      FROM executions e
      JOIN workflows w ON e.workflow_id = w.id
      ORDER BY e.created_at DESC, e.correlation_id DESC
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async create(id: string, workflowId: string, correlationId: string, status: string = ExecutionStatus.RUNNING): Promise<void> {
    const query = `
      INSERT INTO executions (id, workflow_id, correlation_id, status, logs)
      VALUES ($1, $2, $3, $4, '[]'::jsonb)
      ON CONFLICT (correlation_id)
      DO UPDATE SET id = EXCLUDED.id, status = EXCLUDED.status, logs = '[]'::jsonb
    `;
    await pool.query(query, [id, workflowId, correlationId, status]);
  }

  static async updateStatusAndLogs(id: string, status: string, logs: string): Promise<void> {
    const query = `UPDATE executions SET status = $2, logs = $3 WHERE id = $1`;
    await pool.query(query, [id, status, logs]);
  }

  static async deleteOlderThan14Days(): Promise<number> {
    const query = `DELETE FROM executions WHERE created_at < NOW() - INTERVAL '14 days' RETURNING id`;
    const result = await pool.query(query);
    return result.rowCount || 0;
  }
}
