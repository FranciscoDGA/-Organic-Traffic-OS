import { getStrategicServiceSingleton } from './_service-singleton';

export async function POST() {
  const svc = getStrategicServiceSingleton();
  const result = svc.analyze();
  return Response.json(result);
}

export async function GET() {
  const svc = getStrategicServiceSingleton();
  const report = svc.generateReport();
  return Response.json(report);
}
