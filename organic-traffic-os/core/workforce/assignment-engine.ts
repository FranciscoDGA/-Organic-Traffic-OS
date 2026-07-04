import { AgentProfile, TaskAssignment } from './workforce.types';
import { canAcceptTask } from './agent-capacity';

const assignments: TaskAssignment[] = [];
let assignCounter = 0;

export function selectBestAgent(agents: AgentProfile[], requiredCapability: string): AgentProfile | null {
  const candidates = agents.filter(a => canAcceptTask(a) && a.capabilities.includes(requiredCapability));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => (b.reliability * 0.4 + b.quality_score * 0.4 + b.priority * 0.2) - (a.reliability * 0.4 + a.quality_score * 0.4 + a.priority * 0.2))[0];
}

export function assignTask(agentId: string, taskId: string, workspaceId: string): TaskAssignment {
  const assignment: TaskAssignment = { id: `asgn-${Date.now()}-${++assignCounter}`, task_id: taskId, agent_id: agentId, workspace_id: workspaceId, assigned_at: new Date().toISOString(), status: 'assigned' };
  assignments.push(assignment);
  return assignment;
}

export function reassignTask(assignmentId: string, newAgentId: string): TaskAssignment | null {
  const idx = assignments.findIndex(a => a.id === assignmentId);
  if (idx === -1) return null;
  assignments[idx].agent_id = newAgentId;
  return assignments[idx];
}

export function getAssignments() { return assignments; }
