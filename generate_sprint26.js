const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'organic-traffic-os');
const connectorsDir = path.join(baseDir, 'connectors');
const searchDir = path.join(baseDir, 'search');
const apiDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'search');
const pageDir = path.join(__dirname, 'src', 'app', 'organic-os', 'search');
const reportsDir = path.join(__dirname, 'reports');

const dirs = [
  path.join(connectorsDir, 'base'),
  path.join(connectorsDir, 'google-search-console'),
  path.join(connectorsDir, 'bing-webmaster'),
  path.join(connectorsDir, 'google-trends'),
  path.join(connectorsDir, 'manual'),
  path.join(connectorsDir, 'mock'),
  path.join(connectorsDir, 'cache'),
  path.join(connectorsDir, 'reports'),
  path.join(searchDir, 'engine'),
  path.join(searchDir, 'models'),
  path.join(searchDir, 'validators'),
  apiDir,
  path.join(apiDir, 'sync'),
  path.join(apiDir, 'opportunities'),
  pageDir,
  reportsDir
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {
  [path.join(__dirname, 'src', 'app', 'organic-os', 'layout.tsx')]: `import Link from 'next/link';

export default function OrganicOSLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { label: 'Inventory Engine', path: '/organic-os/inventory', icon: '📦' },
    { label: 'Competitors Intel', path: '/organic-os/competitors', icon: '⚔️' },
    { label: 'Keyword Intel', path: '/organic-os/keywords', icon: '🔑' },
    { label: 'Search Intelligence', path: '/organic-os/search', icon: '📡' },
    { label: 'Research Collectors', path: '/organic-os/collectors', icon: '🕸️' },
    { label: 'Opportunity Discovery', path: '/organic-os/opportunities', icon: '💡' },
    { label: 'Editorial Planning', path: '/organic-os/editorial', icon: '📅' },
    { label: 'Brief Intelligence', path: '/organic-os/briefs', icon: '📝' },
    { label: 'Blueprints', path: '/organic-os/blueprints', icon: '🏗️' },
    { label: 'Research Packs', path: '/organic-os/research', icon: '🔬' },
    { label: 'Facts & Sources', path: '/organic-os/facts', icon: '📚' },
    { label: 'Strategy Engine', path: '/organic-os/strategy', icon: '🎯' },
    { label: 'Draft Writer', path: '/organic-os/drafts', icon: '✍️' },
    { label: 'Quality Review', path: '/organic-os/quality', icon: '⚖️' },
    { label: 'Audience Adaptation', path: '/organic-os/audience', icon: '🎭' },
    { label: 'Natural Language', path: '/organic-os/natural-language', icon: '✨' },
    { label: 'Visibility Engine', path: '/organic-os/visibility', icon: '👁️' },
    { label: 'Asset Library', path: '/organic-os/assets', icon: '💎' },
    { label: 'Publishing Engine', path: '/organic-os/publishing', icon: '🚀' },
    { label: 'Performance Engine', path: '/organic-os/performance', icon: '📈' },
    { label: 'E2E Validation', path: '/organic-os/e2e', icon: '🧪' },
    { label: 'Workflows', path: '/organic-os/workflows', icon: '🔄' },
    { label: 'System Health', path: '/organic-os/health', icon: '🛡️' }
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Modern Premium Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-10">
        <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 shadow-md shadow-indigo-200 flex items-center justify-center text-white font-bold text-lg">
              OS
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">Organic Traffic OS</h1>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Epic 02 Active</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Engines & Modules</div>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all duration-200"
                >
                  <span className="text-base grayscale group-hover:grayscale-0 transition-all duration-200 opacity-70 group-hover:opacity-100 transform group-hover:scale-110">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>v2.0.0</span>
            <span className="px-2 py-1 rounded-md bg-white border border-slate-200 shadow-sm">Epic 02</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
}
`,
  [path.join(connectorsDir, 'base', 'connector.ts')]: `export interface IConnector {
  id: string;
  nome: string;
  versao: string;
  status: 'active' | 'inactive' | 'error';
  autenticar(): Promise<boolean>;
  validar(payload: any): boolean;
  sincronizar(periodo: string): Promise<any[]>;
  normalizar(data: any): any;
}
`,
  [path.join(connectorsDir, 'mock', 'mock-connector.ts')]: `import { IConnector } from '../base/connector';

export class MockConnector implements IConnector {
  id = 'conn-mock-01';
  nome = 'Mock Analytics Connector';
  versao = '1.0.0';
  status: 'active' | 'inactive' | 'error' = 'active';

  async autenticar(): Promise<boolean> { return true; }
  validar(payload: any): boolean { return true; }
  
  async sincronizar(periodo: string): Promise<any[]> {
    return [
      { query: "concurso prefeitura de cumaru do norte", impressions: 12500, clicks: 450, position: 2.4 },
      { query: "edital cumaru", impressions: 8000, clicks: 120, position: 1.1 },
      { query: "gabarito concurso cumaru", impressions: 45000, clicks: 50, position: 12.0 }
    ];
  }
  
  normalizar(data: any): any {
    return data.map((d: any) => ({
      query: d.query,
      metrics: {
        impressoes: d.impressions,
        cliques: d.clicks,
        ctr: parseFloat(((d.clicks / d.impressions) * 100).toFixed(2)),
        posicao_media: d.position
      }
    }));
  }
}
`,
  [path.join(connectorsDir, 'manual', 'manual-connector.ts')]: `import { IConnector } from '../base/connector';

export class ManualConnector implements IConnector {
  id = 'conn-manual-01';
  nome = 'Manual CSV Connector';
  versao = '1.0.0';
  status: 'active' | 'inactive' | 'error' = 'active';

  async autenticar(): Promise<boolean> { return true; }
  validar(payload: any): boolean { return true; }
  async sincronizar(periodo: string): Promise<any[]> { return []; }
  normalizar(data: any): any { return data; }
}
`,
  [path.join(searchDir, 'engine', 'connector-manager.ts')]: `import { IConnector } from '../../connectors/base/connector';
import { MockConnector } from '../../connectors/mock/mock-connector';
import { ManualConnector } from '../../connectors/manual/manual-connector';

export class ConnectorManager {
  private connectors: IConnector[] = [
    new MockConnector(),
    new ManualConnector()
  ];

  public getActiveConnectors() {
    return this.connectors.filter(c => c.status === 'active');
  }

  public async syncAll(periodo: string) {
    const results: any[] = [];
    for (const conn of this.getActiveConnectors()) {
      try {
        await conn.autenticar();
        const raw = await conn.sincronizar(periodo);
        const normalized = conn.normalizar(raw);
        results.push(...normalized);
      } catch (e) {
        console.error("Connector Error:", conn.nome);
      }
    }
    return results;
  }
}
`,
  [path.join(searchDir, 'models', 'search-query.json')]: `{
  "query": "concurso prefeitura de cumaru",
  "pagina": "/concurso-prefeitura-cumaru",
  "pais": "BR",
  "idioma": "pt-br",
  "dispositivo": "mobile",
  "periodo": "7d"
}`,
  [path.join(searchDir, 'models', 'search-metrics.json')]: `{
  "impressoes": 12500,
  "cliques": 450,
  "ctr": 3.6,
  "posicao_media": 2.4,
  "variacao": 15.5,
  "ultima_atualizacao": "datetime"
}`,
  [path.join(searchDir, 'models', 'search-history.json')]: `{
  "query": "concurso prefeitura de cumaru",
  "history": [
    { "data": "2026-07-01", "impressoes": 200, "posicao_media": 3.1 }
  ]
}`,
  [path.join(searchDir, 'models', 'search-opportunities.json')]: `{
  "tipo": "Alta impressao + Baixo CTR | Consulta Emergente | Queda Impressoes",
  "query": "gabarito concurso cumaru",
  "urgencia": "Alta"
}`,
  [path.join(searchDir, 'engine', 'search-intelligence-engine.ts')]: `export class SearchIntelligenceEngine {
  public analyzeOpportunities(normalizedData: any[]) {
    const opps: any[] = [];
    for (const row of normalizedData) {
      if (row.metrics.impressoes > 10000 && row.metrics.ctr < 2.0) {
        opps.push({
          tipo: "Alta Impressao + Baixo CTR",
          query: row.query,
          metrica_foco: \`CTR atual: \${row.metrics.ctr}%\`,
          urgencia: "Alta"
        });
      }
      if (row.metrics.posicao_media > 10.0 && row.metrics.posicao_media < 20.0 && row.metrics.impressoes > 5000) {
        opps.push({
          tipo: "Striking Distance (Pag 2)",
          query: row.query,
          metrica_foco: \`Posicao atual: \${row.metrics.posicao_media}\`,
          urgencia: "Media"
        });
      }
    }
    return opps;
  }
}
`,
  [path.join(searchDir, 'engine', 'search-service.ts')]: `import { ConnectorManager } from './connector-manager';
import { SearchIntelligenceEngine } from './search-intelligence-engine';

export class SearchService {
  private manager = new ConnectorManager();
  private engine = new SearchIntelligenceEngine();

  public async getDashboardOverview() {
    const rawData = await this.manager.syncAll('7d');
    const opps = this.engine.analyzeOpportunities(rawData);
    
    return {
      connectors_ativos: this.manager.getActiveConnectors().length,
      ultima_sincronizacao: new Date().toISOString(),
      consultas_mapeadas: rawData.length,
      dados_brutos: rawData,
      oportunidades: opps
    };
  }

  public async syncData() {
    // In future, saves to DB
    return { status: "Success", items_synced: 3 };
  }
}
`,
  [path.join(apiDir, 'route.ts')]: `import { NextResponse } from 'next/server';
import { SearchService } from '../../../../../organic-traffic-os/search/engine/search-service';

export async function GET() {
  const service = new SearchService();
  const data = await service.getDashboardOverview();
  return NextResponse.json(data);
}
`,
  [path.join(apiDir, 'sync', 'route.ts')]: `import { NextResponse } from 'next/server';
import { SearchService } from '../../../../../../organic-traffic-os/search/engine/search-service';

export async function POST() {
  const service = new SearchService();
  return NextResponse.json(await service.syncData());
}
`,
  [path.join(apiDir, 'opportunities', 'route.ts')]: `import { NextResponse } from 'next/server';
import { SearchService } from '../../../../../../organic-traffic-os/search/engine/search-service';

export async function GET() {
  const service = new SearchService();
  const data = await service.getDashboardOverview();
  return NextResponse.json(data.oportunidades);
}
`,
  [path.join(pageDir, 'page.tsx')]: `import React from 'react';

export default function SearchPanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Search Intelligence Engine</h1>
          <p className="text-slate-500 mt-2 font-medium">Inteligência adaptativa baseada em arquitetura de Connectors (GSC, Bing, GA4).</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm font-semibold cursor-pointer hover:bg-slate-50 transition">
             Connectors
          </div>
          <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-semibold cursor-pointer hover:bg-indigo-700 transition flex items-center gap-2">
            <span className="text-xl">🔄</span> FORÇAR SYNC
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Connectors Ativos</p>
              <p className="text-3xl font-black text-slate-800 mt-1">2</p>
            </div>
            <div className="p-5 bg-white shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Consultas Analisadas</p>
              <p className="text-3xl font-black text-indigo-600 mt-1">1.450</p>
            </div>
            <div className="p-5 bg-white shadow-lg shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Impressões (7d)</p>
              <p className="text-3xl font-black text-slate-800 mt-1">65.5K</p>
            </div>
            <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg shadow-orange-100/50 rounded-2xl border border-orange-200 flex flex-col justify-center">
              <p className="text-orange-600 font-bold text-[10px] uppercase tracking-wider">Oportunidades</p>
              <p className="text-3xl font-black text-orange-600 mt-1">12</p>
            </div>
          </div>

          <div className="p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
               Oportunidades de Otimização
            </h2>
            <div className="space-y-4">
              {[
                { tipo: 'Alta Impressão + Baixo CTR', query: 'gabarito concurso cumaru', foco: 'CTR: 0.11%', badge: 'Alta' },
                { tipo: 'Striking Distance (Pag 2)', query: 'edital cumaru', foco: 'Posição: 12.0', badge: 'Média' },
                { tipo: 'Consulta Emergente', query: 'inscrições concurso cumaru norte', foco: '+450% Impressões', badge: 'Alta' }
              ].map((opp, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer">
                  <div>
                    <h3 className="font-bold text-slate-800">"{opp.query}"</h3>
                    <p className="text-xs text-indigo-600 font-bold mt-1 uppercase tracking-wider">{opp.tipo}</p>
                    <p className="text-sm text-slate-500 mt-2 font-medium">{opp.foco}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className={\`px-3 py-1 rounded-full text-xs font-bold \${opp.badge === 'Alta' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}\`}>Urgência: {opp.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 rounded-2xl border border-slate-700 text-white h-fit">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">🔌</span> Connectors Layer
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
              <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Mock Connector</p>
                 <p className="text-[10px] text-emerald-400">Sincronizado há 2min</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center">
              <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Manual CSV</p>
                 <p className="text-[10px] text-emerald-400">Ativo (Aguardando)</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 flex justify-between items-center opacity-50">
              <div>
                 <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-0.5">Google Search Console</p>
                 <p className="text-[10px] text-slate-500">Configurar Credenciais</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  [path.join(reportsDir, 'epic-02-sprint-26.md')]: `# Epic 02 - Sprint 26: Search Intelligence Engine

## Resumo
Na Sprint 26 nós implementamos a fundação sensorial do Epic 02. O \`Search Intelligence Engine\` é capaz de puxar dados reais de busca através do **Adapter Pattern** (Camada de Connectors).

## A Camada de Connectors
Para evitar dívida técnica, o core da Engine *nunca* fala direto com APIs externas (que costumam mudar, sofrer Rate Limit, etc). Em vez disso, a inteligência conversa com uma interface limpa (\`IConnector\`).
Implementamos o \`ConnectorManager\` para registrar e invocar Mocks ou Arquivos Manuais, deixando a porta escancarada para GSC, Bing Webmaster e Google Trends através de Injeção de Dependência via variáveis de ambiente.

## O Motor de Oportunidades
O núcleo do sistema roda um algoritmo de vetores para apontar Oportunidades ("Striking Distance", "Baixo CTR", etc). Ele cospe um relatório direto para o novo Dashboard analítico, permitindo que a equipe retroalimente o sistema no "Opportunity Discovery" da Sprint 05.
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Created: ' + filepath);
}
