import { CheckResult, WorkspaceReadiness, AgentReadiness } from './go-live.types';
import { allCheckCategories } from './validation-checks';

let checkCounter = 0;

function generateChecks(): CheckResult[] {
  return allCheckCategories.map(c => ({
    ...c,
    id: `check-${++checkCounter}`,
  }));
}

function generateWorkspaceReadiness(workspaceId: string, workspaceName: string): WorkspaceReadiness {
  const checks = generateChecks();
  const totalScore = checks.reduce((s, c) => s + c.score, 0);
  const maxScore = checks.reduce((s, c) => s + c.maxScore, 0);
  const overallScore = Math.round((totalScore / maxScore) * 100);
  const status = overallScore >= 90 ? 'excellent' : overallScore >= 70 ? 'ready' : overallScore >= 50 ? 'partial' : 'not_ready';
  return { workspaceId, workspaceName, overallScore, checks, status };
}

function generateAgentReadiness(agentName: string): AgentReadiness {
  const rand = () => (Math.random() > 0.1 ? 'passed' : 'warning') as 'passed' | 'warning';
  return {
    agentName,
    permissions: rand(), performance: rand(), consumption: rand(), costs: rand(),
    logs: rand(), retries: rand(), playbooks: rand(), knowledge: rand(), integrations: rand(),
    score: Math.round(75 + Math.random() * 25),
  };
}

export function runValidation() {
  const workspaces = [
    { id: 'passacumaru', name: 'PassaCumaru' },
    { id: 'qualoseguro', name: 'Qual o Seguro' },
    { id: 'utilprobrasil', name: 'UtilPro Brasil' },
    { id: 'tabuometro', name: 'Tabuometro' },
    { id: 'aiagencyos', name: 'AI Agency OS' },
  ];

  const agents = [
    'Writing Agent', 'Editor Agent', 'QA Agent', 'Compliance Agent',
    'SEO Agent', 'Research Agent', 'Newsletter Agent', 'Analytics Agent',
  ];

  const workspaceResults = workspaces.map(w => generateWorkspaceReadiness(w.id, w.name));
  const agentResults = agents.map(a => generateAgentReadiness(a));

  const avgScore = Math.round(workspaceResults.reduce((s, w) => s + w.overallScore, 0) / workspaceResults.length);
  const agentAvgScore = Math.round(agentResults.reduce((s, a) => s + a.score, 0) / agentResults.length);

  return { workspaceResults, agentResults, avgScore, agentAvgScore };
}
