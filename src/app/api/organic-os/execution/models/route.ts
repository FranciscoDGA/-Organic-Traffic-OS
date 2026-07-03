import { getProviders } from '../_service-singleton';

export async function GET() {
  const providers = getProviders();
  const models = providers.flatMap(p => p.models.map(m => ({ ...m, provider: p.name })));
  return Response.json({ models });
}
