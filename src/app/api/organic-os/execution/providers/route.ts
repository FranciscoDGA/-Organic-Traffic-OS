import { getProviders } from '../_service-singleton';

export async function GET() {
  const providers = getProviders();
  return Response.json({ providers });
}
