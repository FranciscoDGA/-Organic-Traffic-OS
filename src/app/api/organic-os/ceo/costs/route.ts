import { getCEOServiceSingleton } from '../_service-singleton';

export async function GET() {
  const data = getCEOServiceSingleton();
  return Response.json({ costOverview: data.costOverview, executionOverview: data.executionOverview });
}
