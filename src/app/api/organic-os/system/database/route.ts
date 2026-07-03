import { NextResponse } from 'next/server';
import { getSchemas } from '../../../../../../organic-traffic-os/core/database/schemas';
import { getAllTables } from '../../../../../../organic-traffic-os/core/database/tables';
import { getTotalBuckets } from '../../../../../../organic-traffic-os/core/database/storage';
import { getMigrationStatus } from '../../../../../../organic-traffic-os/core/database/migrations';

export async function GET() {
  const schemas = getSchemas();
  const tables = getAllTables();
  const migrationStatus = getMigrationStatus();
  return NextResponse.json({
    success: true,
    data: {
      schemas: schemas.map(s => ({ name: s.name, description: s.description, tableCount: s.tables.length, rls: s.rlsEnabled, audit: s.auditEnabled })),
      totalSchemas: schemas.length,
      totalTables: tables.length,
      totalBuckets: getTotalBuckets(),
      migrations: migrationStatus,
    },
  });
}
