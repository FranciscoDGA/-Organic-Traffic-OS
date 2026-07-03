import { getCEOServiceSingleton } from '../_service-singleton';

export async function GET() {
  const data = getCEOServiceSingleton();
  return Response.json({ actions: data.prioritizedActions, total: data.prioritizedActions.length });
}
