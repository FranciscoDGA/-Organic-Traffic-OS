import { getChiefServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getChiefServiceSingleton();
  return Response.json({ capacity: svc.getCapacity(), workload: svc.getWorkload() });
}
