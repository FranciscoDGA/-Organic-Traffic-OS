import { WorkerSession } from './worker.types';
import { getAllSessions, getActiveSessions, getSessionsByState } from './worker-state';

export function getWorkerStats() {
  const all = getAllSessions();
  const active = getActiveSessions();
  const completed = getSessionsByState('completed');
  const failed = getSessionsByState('failed');
  const totalTokens = all.reduce((s, w) => s + w.tokens_used, 0);
  const totalDuration = completed.reduce((s, w) => s + (w.duration_ms || 0), 0);
  return { total: all.length, active: active.length, completed: completed.length, failed: failed.length, totalTokens, avgDuration: completed.length > 0 ? Math.round(totalDuration / completed.length) : 0 };
}
