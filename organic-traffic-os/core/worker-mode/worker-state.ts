import { WorkerSession, WorkerState } from './worker.types';

const sessions: WorkerSession[] = [];
let workerCounter = 0;

export function createSession(params: { agent_id: string; agent_name: string; workspace_id: string; mission_id?: string; workflow_id?: string; task_id?: string; provider?: string }): WorkerSession {
  const session: WorkerSession = {
    id: `worker-${Date.now()}-${++workerCounter}`, agent_id: params.agent_id, agent_name: params.agent_name, workspace_id: params.workspace_id, mission_id: params.mission_id, workflow_id: params.workflow_id, task_id: params.task_id, state: 'idle', tokens_used: 0, provider: params.provider || 'openai', started_at: new Date().toISOString(), last_heartbeat: new Date().toISOString(), logs: [], retry_count: 0,
  };
  sessions.push(session);
  return session;
}

export function getSession(id: string) { return sessions.find(s => s.id === id); }
export function getAllSessions() { return sessions; }
export function getSessionsByState(state: WorkerState) { return sessions.filter(s => s.state === state); }
export function getSessionsByAgent(agentId: string) { return sessions.filter(s => s.agent_id === agentId); }

export function updateSessionState(id: string, state: WorkerState, result?: string, error?: string) {
  const session = getSession(id);
  if (!session) return null;
  session.state = state;
  session.last_heartbeat = new Date().toISOString();
  if (result) session.result = result;
  if (error) session.error = error;
  if (state === 'completed' || state === 'failed' || state === 'cancelled') {
    session.finished_at = new Date().toISOString();
    session.duration_ms = new Date(session.finished_at).getTime() - new Date(session.started_at).getTime();
  }
  session.logs.push(`[${new Date().toISOString()}] State -> ${state}`);
  return session;
}

export function addTokens(id: string, tokens: number) {
  const session = getSession(id);
  if (session) { session.tokens_used += tokens; session.last_heartbeat = new Date().toISOString(); }
}

export function getActiveSessions() { return sessions.filter(s => ['running', 'waiting', 'paused', 'retrying'].includes(s.state)); }
