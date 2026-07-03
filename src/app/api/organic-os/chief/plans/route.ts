import { getChiefServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getChiefServiceSingleton();
  const plans = svc.getPlans();
  return Response.json({ plans, total: plans.length });
}
