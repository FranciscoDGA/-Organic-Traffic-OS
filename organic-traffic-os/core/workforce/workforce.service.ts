import { AgentProfile, AgentPerformance, TaskAssignment } from './workforce.types';
import { getAllAgents, getAgentsByWorkspace, getAvailableAgents, getAgentById } from './agent-registry';
import { getAgentCapacity, canAcceptTask } from './agent-capacity';
import { calculatePerformance } from './agent-performance';
import { balanceWorkload } from './workload-balancer';
import { selectBestAgent, assignTask, reassignTask, getAssignments } from './assignment-engine';

export function getWorkforceService() {
  return {
    getAgents(workspaceId?: string) { return workspaceId ? getAgentsByWorkspace(workspaceId) : getAllAgents(); },
    getAvailableAgents() { return getAvailableAgents(); },
    getAgent(id: string) { return getAgentById(id); },
    getCapacity(agentId: string) { const a = getAgentById(agentId); return a ? getAgentCapacity(a) : null; },
    getPerformance(agentId: string) { const a = getAgentById(agentId); return a ? calculatePerformance(a) : null; },
    getAllPerformance() { return getAllAgents().map(a => calculatePerformance(a)); },
    balanceWorkload(workspaceId?: string) { return balanceWorkload(workspaceId ? getAgentsByWorkspace(workspaceId) : getAllAgents()); },
    assign(taskId: string, capability: string, workspaceId: string) {
      const agent = selectBestAgent(getAgentsByWorkspace(workspaceId), capability);
      if (!agent) return { error: 'No suitable agent found' };
      return assignTask(agent.id, taskId, workspaceId);
    },
    reassign(assignmentId: string, newAgentId: string) { return reassignTask(assignmentId, newAgentId); },
    getAssignments() { return getAssignments(); },
    canAccept(agentId: string) { const a = getAgentById(agentId); return a ? canAcceptTask(a) : false; },
  };
}
