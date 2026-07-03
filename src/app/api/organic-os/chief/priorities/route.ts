import { getChiefServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getChiefServiceSingleton();
  return Response.json({ priorities: svc.getPriorities() });
}
