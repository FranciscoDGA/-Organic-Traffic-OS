import { DayResult } from './autonomous.types';
import { workspaceMissionWeights } from './simulation-config';

const agents = ['Writing Agent', 'Editor Agent', 'QA Agent', 'Compliance Agent', 'SEO Agent', 'Research Agent'];
const workflows = ['article', 'review', 'pillar', 'faq', 'campaign', 'newsletter', 'refresh'];

function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomPick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function simulateDay(day: number, date: string, workspaces: string[]): DayResult {
  let totalMissions = 0;
  let completed = 0;
  let failed = 0;
  let publications = 0;
  let tokens = 0;
  let cost = 0;
  let errors = 0;
  let retries = 0;
  const alerts: string[] = [];
  const agentsUsed: string[] = [];
  const workflowsExecuted: string[] = [];

  for (const ws of workspaces) {
    const weights = workspaceMissionWeights[ws];
    if (!weights) continue;
    const missionsToday = Math.max(1, Math.round(weights.avgPerDay + (Math.random() - 0.5)));
    totalMissions += missionsToday;

    for (let i = 0; i < missionsToday; i++) {
      const agent = randomPick(agents);
      const workflow = randomPick(workflows);
      if (!agentsUsed.includes(agent)) agentsUsed.push(agent);
      if (!workflowsExecuted.includes(workflow)) workflowsExecuted.push(workflow);

      const missionTokens = randomInt(200, 1200);
      tokens += missionTokens;
      cost += missionTokens * 0.00001;

      if (Math.random() > 0.05) {
        completed++;
        publications++;
      } else {
        failed++;
        errors++;
        if (Math.random() > 0.5) retries++;
        alerts.push(`Falha na missao ${workflow} do ${ws}`);
      }
    }
  }

  if (Math.random() > 0.9) alerts.push('Queue de publicacao congestionada');
  if (Math.random() > 0.95) alerts.push('Agent com latencia elevada');

  return {
    day, date, status: failed > totalMissions * 0.2 ? 'failed' : 'completed',
    missionsGenerated: totalMissions, missionsCompleted: completed, missionsFailed: failed,
    publicationsSimulated: publications, tokensUsed: tokens, costIncurred: parseFloat(cost.toFixed(4)),
    errors, retries, alerts, durationMs: randomInt(5000, 15000),
    agentsUsed, workflowsExecuted,
  };
}
