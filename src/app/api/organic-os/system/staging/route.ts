import { NextResponse } from 'next/server';
import { featureFlags } from '../../../../../../organic-traffic-os/core/infrastructure/feature-flags';
import { getEnvironmentState } from '../../../../../../organic-traffic-os/core/infrastructure/environment/environment-state';
import { FAKE_WORKSPACES, generateFakeArticles, generateFakeMissions } from '../../../../../../organic-traffic-os/core/infrastructure/fake-data';

export async function GET() {
  const state = getEnvironmentState();
  const stagingActive = featureFlags.isEnabled('ENABLE_STAGING');

  const workspaces = FAKE_WORKSPACES.map(ws => ({
    ...ws,
    articles: generateFakeArticles(ws.id, 3).length,
    missions: generateFakeMissions(ws.id, 2).length,
  }));

  return NextResponse.json({
    success: true,
    data: {
      active: stagingActive,
      lastDeployment: state.staging.lastDeployment,
      validated: state.staging.validated,
      workspaces,
      totalArticles: workspaces.reduce((sum, w) => sum + w.articles, 0),
      totalMissions: workspaces.reduce((sum, w) => sum + w.missions, 0),
    },
  });
}
