import { NextResponse } from 'next/server';
import { featureFlags } from '../../../../../../organic-traffic-os/core/infrastructure/feature-flags';
import { getEnvironmentState, resetSandbox } from '../../../../../../organic-traffic-os/core/infrastructure/environment/environment-state';
import { FAKE_WORKSPACES, generateFakeArticles, generateFakeAgents, generateFakeMissions } from '../../../../../../organic-traffic-os/core/infrastructure/fake-data';

export async function GET() {
  const state = getEnvironmentState();
  const sandboxActive = featureFlags.isEnabled('ENABLE_SANDBOX');

  const workspaces = FAKE_WORKSPACES.map(ws => ({
    ...ws,
    articles: generateFakeArticles(ws.id),
    agents: generateFakeAgents(ws.id),
    missions: generateFakeMissions(ws.id),
  }));

  return NextResponse.json({
    success: true,
    data: {
      active: sandboxActive,
      lastReset: state.sandbox.lastReset,
      testRuns: state.sandbox.testRuns,
      workspaces,
      summary: {
        totalWorkspaces: workspaces.length,
        totalArticles: workspaces.reduce((sum, w) => sum + w.articles.length, 0),
        totalAgents: workspaces.reduce((sum, w) => sum + w.agents.length, 0),
        totalMissions: workspaces.reduce((sum, w) => sum + w.missions.length, 0),
      },
    },
  });
}
