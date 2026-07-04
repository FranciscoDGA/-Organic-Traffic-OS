import { WorkerSession, HeartbeatData } from './worker.types';
import { getActiveSessions, getSession, updateSessionState } from './worker-state';

export function heartbeat(workerId: string): HeartbeatData | null {
  const session = getSession(workerId);
  if (!session) return null;
  session.last_heartbeat = new Date().toISOString();
  const elapsed_ms = new Date().getTime() - new Date(session.started_at).getTime();
  return { worker_id: session.id, state: session.state, progress: session.state === 'completed' ? 100 : session.state === 'running' ? Math.min(90, Math.floor((session.tokens_used / 1000) * 10)) : 0, tokens_used: session.tokens_used, elapsed_ms, last_activity: session.last_heartbeat };
}

export function heartbeatAll(): HeartbeatData[] {
  return getActiveSessions().map(s => heartbeat(s.id)).filter((h): h is HeartbeatData => h !== null);
}

export function checkStaleWorkers(timeoutMs = 300000): string[] {
  const stale: string[] = [];
  getActiveSessions().forEach(s => {
    const elapsed = new Date().getTime() - new Date(s.last_heartbeat).getTime();
    if (elapsed > timeoutMs) { stale.push(s.id); updateSessionState(s.id, 'failed', undefined, 'Heartbeat timeout'); }
  });
  return stale;
}
