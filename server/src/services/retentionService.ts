import { ExecutionRepository } from '../repositories/execution.repository';

export const startLogRetentionCleanup = (): void => {
  const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;
  
  const runCleanup = async () => {
    try {
      console.log('[Retention] Running execution logs cleanup (deleting traces older than 14 days)...');
      const deletedCount = await ExecutionRepository.deleteOlderThan14Days();
      console.log(`[Retention] Cleanup completed. Deleted ${deletedCount} old execution logs.`);
    } catch (err) {
      console.error('[Retention] Failed to run execution logs cleanup:', err);
    }
  };

  runCleanup();
  setInterval(runCleanup, CLEANUP_INTERVAL);
};
