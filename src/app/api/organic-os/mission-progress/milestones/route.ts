import { getMissionProgressServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getMissionProgressServiceSingleton();
  return Response.json({ milestones: svc.getMilestones(), total: svc.getMilestones().length });
}
