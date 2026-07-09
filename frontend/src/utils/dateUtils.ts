/**
 * Standard utility for formatting dates and calculating durations.
 * Follows DRY principles for reuse across the application.
 */

export const getRelativeTime = (dateString?: string, t?: (key: string, def: string) => string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const translate = (key: string, def: string) => (t ? t(key, def) : def);

  if (diffInSeconds < 60) return translate('logs.time.justNow', 'just now');
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}${translate('logs.time.m_ago', 'm ago')}`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}${translate('logs.time.h_ago', 'h ago')}`;
  return `${Math.floor(diffInSeconds / 86400)}${translate('logs.time.d_ago', 'd ago')}`;
};

export const getExecutionDuration = (steps: { startTime: string; endTime: string }[]): string => {
  if (!steps || steps.length === 0) return '';
  
  // Find the earliest start time and latest end time across all steps
  let earliest = new Date(steps[0].startTime).getTime();
  let latest = new Date(steps[0].endTime).getTime();

  steps.forEach(step => {
    const start = new Date(step.startTime).getTime();
    const end = new Date(step.endTime).getTime();
    if (start < earliest) earliest = start;
    if (end > latest) latest = end;
  });

  const durationMs = latest - earliest;
  if (durationMs < 1000) return `${durationMs}ms`;
  return `${(durationMs / 1000).toFixed(2)}s`;
};
