import { getChiefServiceSingleton } from '../_service-singleton';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const svc = getChiefServiceSingleton();
  const plan = svc.createDailyPlan(body.workspaceId);
  return Response.json({ plan });
}
