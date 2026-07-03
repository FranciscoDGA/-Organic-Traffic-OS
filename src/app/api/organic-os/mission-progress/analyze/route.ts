import { getMissionProgressServiceSingleton } from '../_service-singleton';

export async function POST() {
  const svc = getMissionProgressServiceSingleton();
  const data = svc.getAll();
  return Response.json({ analyzed: data.length, missions: data });
}
