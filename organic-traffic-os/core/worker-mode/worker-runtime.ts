import { WorkerSession, WorkerState } from './worker.types';
import { createSession, updateSessionState, addTokens, getSession } from './worker-state';
import { executeWorker, WorkerExecuteParams, AgentExecutionResult } from './worker-executor';

export function startWorker(params: { agent_id: string; agent_name: string; workspace_id: string; mission_id?: string; workflow_id?: string; task_id?: string; provider?: string }): WorkerSession {
  const session = createSession(params);
  updateSessionState(session.id, 'waiting');
  session.logs.push(`[${new Date().toISOString()}] Worker started for ${params.agent_name}`);
  return session;
}

export async function executeWorkerAsync(params: WorkerExecuteParams): Promise<AgentExecutionResult> {
  return executeWorker(params);
}

export function pauseWorker(id: string): WorkerSession | null {
  const session = getSession(id);
  if (!session || session.state !== 'running') return null;
  return updateSessionState(id, 'paused');
}

export function resumeWorker(id: string): WorkerSession | null {
  const session = getSession(id);
  if (!session || session.state !== 'paused') return null;
  return updateSessionState(id, 'running');
}

export function cancelWorker(id: string): WorkerSession | null {
  const session = getSession(id);
  if (!session || ['completed', 'failed', 'cancelled'].includes(session.state)) return null;
  return updateSessionState(id, 'cancelled');
}

export function retryWorker(id: string): WorkerSession | null {
  const session = getSession(id);
  if (!session || !['failed', 'cancelled'].includes(session.state)) return null;
  session.retry_count += 1;
  session.state = 'retrying';
  session.logs.push(`[${new Date().toISOString()}] Retry #${session.retry_count}`);
  return updateSessionState(id, 'waiting');
}

export function finishWorker(id: string, result: string): WorkerSession | null {
  return updateSessionState(id, 'completed', result);
}

export function failWorker(id: string, error: string): WorkerSession | null {
  return updateSessionState(id, 'failed', undefined, error);
}
