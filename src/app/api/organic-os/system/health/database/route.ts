import { NextResponse } from 'next/server';
import { getSchemas } from '../../../../../../../organic-traffic-os/core/database/schemas';
import { getAllTables } from '../../../../../../../organic-traffic-os/core/database/tables';
import { getMigrationStatus } from '../../../../../../../organic-traffic-os/core/database/migrations';

export async function GET() {
  const schemas = getSchemas();
  const tables = getAllTables();
  const migrations = getMigrationStatus();
  const allHealthy = migrations.pending === 0;
  return NextResponse.json({
    success: true,
    data: {
      status: allHealthy ? 'healthy' : 'degraded',
      schemas: schemas.length,
      tables: tables.length,
      migrations: migrations,
      connectionPool: { active: 1, idle: 3, max: 10 },
      lastCheck: new Date().toISOString(),
    },
  });
}
