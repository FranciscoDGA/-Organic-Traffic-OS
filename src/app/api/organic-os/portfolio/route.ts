import { getPortfolioServiceSingleton } from './_service-singleton';

export async function GET() {
  const svc = getPortfolioServiceSingleton();
  const report = svc.getReport();
  return Response.json(report);
}
