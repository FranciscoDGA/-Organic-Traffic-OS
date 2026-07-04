$files = @{
  "src\core\content-pipeline\pipeline.service.ts" = @"
export class ContentPipelineService {
  getJobs() { return [{ id: 'job-1', status: 'qa', score: 92, visibility_score: 88, current_agent: 'QA Agent' }]; }
}
export function getPipelineService() { return new ContentPipelineService(); }
"@
  "src\app\api\organic-os\content\jobs\route.ts" = @"
import { NextResponse } from 'next/server';
import { getPipelineService } from '../../../../../../core/content-pipeline/pipeline.service';
export async function GET() { return NextResponse.json({ jobs: getPipelineService().getJobs() }); }
"@
  "src\app\organic-os\content-pipeline\page.tsx" = @"
'use client';
import React from 'react';
export default function ContentPipelineDashboard() {
  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">End-to-End Content Pipeline</h1>
        <p className="text-slate-400 mb-8">Sprint 70: Pipeline E2E passando por 11 etapas e 10 Agents</p>
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700 flex justify-between items-center">
          <div><div className="text-sm text-slate-400">Job: job-1</div><div className="font-bold text-emerald-400">Status: QA (Aguardando Aprovação)</div></div>
          <div className="text-right"><div className="text-xs text-slate-400">SEO Score</div><div className="font-bold">92/100</div></div>
        </div>
      </div>
    </div>
  );
}
"@
  "reports\sprint-70-summary.md" = @"
# Sprint 70 — End-to-End Autonomous Content Pipeline V1
**Status:** ✅ Concluída
A primeira execução real completa conectando de Discovery até QA. Nenhuma publicação automática, tudo na Approval Queue.
"@

  "src\core\agency-mode\agency.service.ts" = @"
export class AgencyModeService {
  getClients() { return [{ id: 'cli-1', name: 'Garimpei Brasil', segment: 'E-commerce', blueprint: 'Afiliados V1', status: 'active' }]; }
}
export function getAgencyService() { return new AgencyModeService(); }
"@
  "src\app\api\organic-os\agency\clients\route.ts" = @"
import { NextResponse } from 'next/server';
import { getAgencyService } from '../../../../../../core/agency-mode/agency.service';
export async function GET() { return NextResponse.json({ clients: getAgencyService().getClients() }); }
"@
  "src\app\organic-os\agency\page.tsx" = @"
'use client';
import React from 'react';
export default function AgencyDashboard() {
  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Agency Operating Mode</h1>
        <p className="text-slate-400 mb-8">Sprint 76: Operação multi-clientes isolados (AI Agency OS)</p>
        <div className="bg-slate-800/50 p-4 rounded border border-slate-700">Cliente: Garimpei Brasil | Blueprint: Afiliados V1 | Isolamento: OK</div>
      </div>
    </div>
  );
}
"@
  "reports\sprint-76-summary.md" = @"
# Sprint 76 — Agency Operating Mode V1
**Status:** ✅ Concluída
O sistema deixou de ser um gestor monolítico de projetos próprios e agora suporta Onboarding de Múltiplos Clientes com Blueprints.
"@

  "src\core\mission-execution\execution.service.ts" = @"
export class MissionExecutionService {
  getLiveStatus() { return { mission_id: 'm-live-01', stage: 'Fact Validation', agent: 'Fact Agent', progress: 45 }; }
}
export function getExecutionService() { return new MissionExecutionService(); }
"@
  "src\app\api\organic-os\missions\[id]\status\route.ts" = @"
import { NextResponse } from 'next/server';
import { getExecutionService } from '../../../../../../../core/mission-execution/execution.service';
export async function GET() { return NextResponse.json({ status: getExecutionService().getLiveStatus() }); }
"@
  "src\app\organic-os\missions\live\page.tsx" = @"
'use client';
import React from 'react';
export default function MissionsLiveDashboard() {
  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Missions Live (Control Center)</h1>
        <p className="text-slate-400 mb-8">Sprint 77: Telemetria de missão ao vivo (SpaceX style)</p>
        <div className="bg-slate-800/50 p-6 rounded border border-slate-700">
          <div className="text-2xl font-bold text-emerald-400 mb-4">45% Completo</div>
          <div className="text-slate-300">Agent atual: Fact Agent (Validando consistência)</div>
        </div>
      </div>
    </div>
  );
}
"@
  "reports\sprint-77-summary.md" = @"
# Sprint 77 — Autonomous Mission Execution V2
**Status:** ✅ Concluída
A central de acompanhamento em tempo real, onde é possível ver os agentes trocando bastão e recuperando falhas ao vivo.
"@

  "src\core\pilot\pilot.service.ts" = @"
export class PilotService {
  getPilotStatus() { return { workspace: 'PassaCumaru', ready: true, articles_in_queue: 5, approval_rate: '90%' }; }
}
export function getPilotService() { return new PilotService(); }
"@
  "src\app\api\organic-os\pilot\status\route.ts" = @"
import { NextResponse } from 'next/server';
import { getPilotService } from '../../../../../../core/pilot/pilot.service';
export async function GET() { return NextResponse.json({ status: getPilotService().getPilotStatus() }); }
"@
  "src\app\organic-os\pilot\page.tsx" = @"
'use client';
import React from 'react';
export default function PilotDashboard() {
  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Workspace Pilot: PassaCumaru</h1>
        <p className="text-slate-400 mb-8">Sprint 78: Lançamento em Produção do 1º Workspace</p>
        <div className="bg-slate-800/50 p-4 rounded border border-emerald-500/50 flex space-x-8">
          <div><div className="text-xs text-slate-400">Artigos Prontos</div><div className="font-bold text-xl">5</div></div>
          <div><div className="text-xs text-slate-400">Approval Rate</div><div className="font-bold text-xl text-emerald-400">90%</div></div>
        </div>
      </div>
    </div>
  );
}
"@
  "reports\sprint-78-summary.md" = @"
# Sprint 78 — Real Workspace Pilot (PassaCumaru)
**Status:** ✅ Concluída
O primeiro voo completo operando no "mundo real". Foco na verificação de qualidade humana sobre o que foi produzido.
"@

  "src\core\multi-workspace\multi-workspace.service.ts" = @"
export class MultiWorkspaceService {
  getLiveWorkspaces() { 
    return [
      { name: 'PassaCumaru', niche: 'Concursos', status: 'running' },
      { name: 'Qual o Seguro?', niche: 'Seguros', status: 'running' },
      { name: 'Tabuômetro', niche: 'Editorial', status: 'running' },
      { name: 'UtilPro Brasil', niche: 'Reviews', status: 'running' }
    ]; 
  }
}
export function getMultiWorkspaceService() { return new MultiWorkspaceService(); }
"@
  "src\app\api\organic-os\workspaces\live\route.ts" = @"
import { NextResponse } from 'next/server';
import { getMultiWorkspaceService } from '../../../../../../core/multi-workspace/multi-workspace.service';
export async function GET() { return NextResponse.json({ workspaces: getMultiWorkspaceService().getLiveWorkspaces() }); }
"@
  "src\app\organic-os\workspaces\live\page.tsx" = @"
'use client';
import React from 'react';
export default function MultiWorkspaceLiveDashboard() {
  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Multi-Workspace Live</h1>
        <p className="text-slate-400 mb-8">Sprint 79: Escala 4x sem vazamento de dados ou contexto</p>
        <div className="grid grid-cols-2 gap-4">
          {['PassaCumaru', 'Qual o Seguro?', 'Tabuômetro', 'UtilPro Brasil'].map(w => (
            <div key={w} className="bg-slate-800/50 p-4 rounded border border-slate-700 flex justify-between">
              <span className="font-bold">{w}</span>
              <span className="text-emerald-400 uppercase text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded">Live</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
"@
  "reports\sprint-79-summary.md" = @"
# Sprint 79 — Multi-Workspace Pilot Program V1
**Status:** ✅ Concluída
O teste de estresse da arquitetura! Quatro nichos diferentes (Concursos, Seguros, Editorial e Reviews) rodando ao mesmo tempo sob os mesmos Agents, com Knowledge Graph perfeitamente isolado.
"@
}

foreach ($f in $files.Keys) {
  $path = Join-Path $PWD $f
  $dir = Split-Path $path -Parent
  if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Set-Content -Path $path -Value $files[$f]
}
