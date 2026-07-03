import { getCEOServiceSingleton } from '../_service-singleton';

export async function GET() {
  const data = getCEOServiceSingleton();
  return Response.json({ summary: data.summary, healthScore: data.healthScore, growthScore: data.growthScore, riskScore: data.riskScore, totalWorkspaces: data.totalWorkspaces });
}
