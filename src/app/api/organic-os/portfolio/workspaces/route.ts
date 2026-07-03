import { getPortfolioServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getPortfolioServiceSingleton();
  const workspaces = svc.getWorkspaces();
  return Response.json({ workspaces, total: workspaces.length });
}
