import { WorkerSession } from './worker.types';
import { createSession, updateSessionState, addTokens, getActiveSessions, getAllSessions } from './worker-state';
import { startWorker, pauseWorker, resumeWorker, cancelWorker, retryWorker, finishWorker, failWorker, executeWorkerAsync } from './worker-runtime';
import { heartbeat, heartbeatAll, checkStaleWorkers } from './worker-heartbeat';
import { getWorkerStats } from './worker-monitor';
import { WorkerExecuteParams, AgentExecutionResult } from './worker-executor';

export function getWorkerService() {
  return {
    start: startWorker,
    execute: executeWorkerAsync,
    pause: pauseWorker,
    resume: resumeWorker,
    cancel: cancelWorker,
    retry: retryWorker,
    finish: finishWorker,
    fail: failWorker,
    heartbeat,
    heartbeatAll,
    checkStale: checkStaleWorkers,
    getStats: getWorkerStats,
    getActive: getActiveSessions,
    getAll: () => getAllSessions(),
  };
}
