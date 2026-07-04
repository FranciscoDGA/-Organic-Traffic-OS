import { WorkerSession, HeartbeatData } from './worker.types';
import { createSession, updateSessionState, addTokens, getSession, getAllSessions, getActiveSessions } from './worker-state';
import { heartbeat, heartbeatAll } from './worker-heartbeat';

export interface AgentExecutionResult {
  agent_id: string;
  agent_name: string;
  success: boolean;
  output: string;
  tokens_used: number;
  duration_ms: number;
  data?: Record<string, any>;
}

export interface WorkerExecuteParams {
  agent_id: string;
  agent_name: string;
  workspace_id: string;
  mission_id?: string;
  workflow_id?: string;
  task_id?: string;
  provider?: string;
  agent_type?: string;
  context?: Record<string, any>;
}

const AGENT_EXECUTION_TIMES: Record<string, { min: number; max: number }> = {
  'research': { min: 1000, max: 3000 },
  'writer': { min: 2000, max: 5000 },
  'monitoring': { min: 500, max: 1500 },
  'publishing': { min: 1000, max: 2000 },
  'discovery': { min: 1500, max: 4000 },
  'fact': { min: 800, max: 2000 },
  'planning': { min: 1000, max: 2500 },
  'review': { min: 1200, max: 3000 },
};

const AGENT_OUTPUTS: Record<string, (ctx: Record<string, any>) => string> = {
  'research': (ctx) => `Research completed: found ${Math.floor(Math.random() * 20) + 5} opportunities for "${ctx.topic || 'general'}"`,
  'writer': (ctx) => `Content written: ${Math.floor(Math.random() * 2000) + 500} words on "${ctx.topic || 'topic'}"`,
  'monitoring': (ctx) => `Monitoring check: ${Math.floor(Math.random() * 10) + 1} alerts detected, system healthy`,
  'publishing': (ctx) => `Publishing prepared: draft ready for review, ${Math.floor(Math.random() * 3) + 1} assets attached`,
  'discovery': (ctx) => `Discovery scan: ${Math.floor(Math.random() * 15) + 3} new keyword clusters identified`,
  'fact': (ctx) => `Fact-check: ${Math.floor(Math.random() * 50) + 10} claims verified, ${Math.floor(Math.random() * 3)} conflicts found`,
  'planning': (ctx) => `Planning phase: ${Math.floor(Math.random() * 8) + 2} tasks added to backlog, priority re-ranked`,
  'review': (ctx) => `Review complete: score ${Math.floor(Math.random() * 30) + 70}/100, ${Math.floor(Math.random() * 5) + 1} suggestions`,
};

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getAgentType(agentId: string, agentType?: string): string {
  if (agentType) return agentType.toLowerCase();
  const id = agentId.toLowerCase();
  for (const key of Object.keys(AGENT_EXECUTION_TIMES)) {
    if (id.includes(key)) return key;
  }
  return 'research';
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export async function executeWorker(params: WorkerExecuteParams): Promise<AgentExecutionResult> {
  const session = createSession({
    agent_id: params.agent_id,
    agent_name: params.agent_name,
    workspace_id: params.workspace_id,
    mission_id: params.mission_id,
    workflow_id: params.workflow_id,
    task_id: params.task_id,
    provider: params.provider,
  });

  updateSessionState(session.id, 'waiting');
  session.logs.push(`[${new Date().toISOString()}] Worker initialized for ${params.agent_name}`);

  const agentType = getAgentType(params.agent_id, params.agent_type);
  const execRange = AGENT_EXECUTION_TIMES[agentType] || AGENT_EXECUTION_TIMES['research'];

  await sleep(100);
  updateSessionState(session.id, 'running');
  session.logs.push(`[${new Date().toISOString()}] Agent execution started (type: ${agentType})`);

  const execTime = Math.random() * (execRange.max - execRange.min) + execRange.min;
  const progressInterval = setInterval(() => {
    heartbeat(session.id);
  }, 2000);

  try {
    await sleep(execTime);
    clearInterval(progressInterval);

    const outputFn = AGENT_OUTPUTS[agentType] || AGENT_OUTPUTS['research'];
    const output = outputFn(params.context || {});
    const tokens = estimateTokens(output) + Math.floor(Math.random() * 200) + 50;

    addTokens(session.id, tokens);
    session.logs.push(`[${new Date().toISOString()}] Agent completed: ${output}`);

    const completed = updateSessionState(session.id, 'completed', output);
    if (completed) {
      completed.tokens_used = tokens;
    }

    return {
      agent_id: params.agent_id,
      agent_name: params.agent_name,
      success: true,
      output,
      tokens_used: tokens,
      duration_ms: completed?.duration_ms || execTime,
      data: {
        agent_type: agentType,
        session_id: session.id,
        provider: params.provider || 'openai',
        workspace_id: params.workspace_id,
      },
    };
  } catch (err: any) {
    clearInterval(progressInterval);
    session.logs.push(`[${new Date().toISOString()}] Execution failed: ${err.message}`);
    updateSessionState(session.id, 'failed', undefined, err.message);

    return {
      agent_id: params.agent_id,
      agent_name: params.agent_name,
      success: false,
      output: `Execution failed: ${err.message}`,
      tokens_used: 0,
      duration_ms: Date.now() - new Date(session.started_at).getTime(),
    };
  }
}

export function getWorkerExecutor() {
  return {
    execute: executeWorker,
    getSession,
    getAllSessions,
    getActiveSessions,
    heartbeat,
    heartbeatAll,
    getAgentType,
  };
}
