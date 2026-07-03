import { getPortfolioServiceSingleton } from '../_service-singleton';

export async function GET() {
  const svc = getPortfolioServiceSingleton();
  return Response.json(svc.getCapacity());
}
