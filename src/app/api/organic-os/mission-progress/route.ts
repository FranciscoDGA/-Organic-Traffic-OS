import { getMissionProgressServiceSingleton } from './_service-singleton';

export async function GET() {
  const svc = getMissionProgressServiceSingleton();
  const data = svc.getAll();
  return Response.json({ missions: data, total: data.length });
}
