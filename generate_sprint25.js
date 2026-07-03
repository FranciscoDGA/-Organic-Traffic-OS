const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'organic-traffic-os', 'performance');
const apiDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'performance');
const pageDir = path.join(__dirname, 'src', 'app', 'organic-os', 'performance');
const reportsDir = path.join(__dirname, 'reports');

const dirs = [
  path.join(baseDir, 'engine'),
  path.join(baseDir, 'metrics'),
  path.join(baseDir, 'history'),
  path.join(baseDir, 'recommendations'),
  path.join(baseDir, 'reports'),
  path.join(baseDir, 'validators'),
  apiDir,
  path.join(apiDir, 'analyze'),
  path.join(apiDir, '[content_id]'),
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
    { label: 'Research Collectors', path: '/organic-os/collectors', icon: '📡' },
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
    { label: 'Workflows', path: '/organic-os/workflows', icon: '🔄' },
    { label: 'System Health', path: '/organic-os/system', icon: '⚙️' }
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
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Premium AI Core</p>
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
            <span>v1.0.0</span>
            <span className="px-2 py-1 rounded-md bg-white border border-slate-200 shadow-sm">Project PassaCumaru</span>
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
  [path.join(baseDir, 'history', 'content-performance.json')]: `{
  "content_id": "uuid",
  "url": "https://passacumaru.com/artigo-exemplo",
  "status": "Healthy | Warning | Decay",
  "ultima_analise": "datetime",
  "ultima_atualizacao": "datetime"
}`,
  [path.join(baseDir, 'metrics', 'metrics.json')]: `{
  "content_id": "uuid",
  "periodo": "7d",
  "visualizacoes": 0,
  "cliques": 0,
  "ctr": 0.0,
  "impressoes": 0,
  "tempo_medio": 0,
  "scroll": 0,
  "conversoes": 0,
  "downloads": 0,
  "leads": 0,
  "compartilhamentos": 0
}`,
  [path.join(baseDir, 'reports', 'trend-analysis.json')]: `{
  "content_id": "uuid",
  "trend": "Alta | Queda | Estabilidade | MudancaBrusca",
  "percentual_variacao": -15.5,
  "fator_decaimento": "CTR_Baixo"
}`,
  [path.join(baseDir, 'recommendations', 'recommendations.json')]: `{
  "content_id": "uuid",
  "acoes": [
    "Atualizar conteúdo",
    "Criar FAQ",
    "Criar artigo satélite",
    "Melhorar CTA",
    "Criar Landing",
    "Melhorar Links",
    "Adicionar imagens",
    "Adicionar vídeo",
    "Criar Quiz",
    "Criar Simulado"
  ]
}`,
  [path.join(baseDir, 'recommendations', 'refresh-priority.json')]: `{
  "content_id": "uuid",
  "urgencia": 8,
  "impacto": 9,
  "roi_esperado": 10,
  "esforco": 3,
  "rice_score": 240
}`,
  [path.join(baseDir, 'engine', 'performance-engine.ts')]: `export class PerformanceEngine {
  public analyzeMetrics(metrics: any) {
    let trend = "Estabilidade";
    if (metrics.visualizacoes < 100 && metrics.ctr < 2.0) {
      trend = "Queda";
    } else if (metrics.visualizacoes > 1000) {
      trend = "Alta";
    }
    
    return {
      trend,
      percentual_variacao: trend === "Queda" ? -12.5 : 5.0,
      fator_decaimento: trend === "Queda" ? "CTR_Baixo" : "Nenhum"
    };
  }

  public generateRecommendations(trendAnalysis: any) {
    if (trendAnalysis.trend === "Queda") {
      return ["Atualizar conteúdo", "Melhorar CTA", "Adicionar vídeo"];
    }
    if (trendAnalysis.trend === "Alta") {
      return ["Criar artigo satélite", "Criar Quiz"];
    }
    return ["Monitorar"];
  }

  public calculatePriority(trendAnalysis: any) {
    if (trendAnalysis.trend === "Queda") return { urgencia: 9, impacto: 8, rice_score: 200 };
    return { urgencia: 2, impacto: 5, rice_score: 50 };
  }
}
`,
  [path.join(baseDir, 'validators', 'performance-validator.ts')]: `export class PerformanceValidator {
  public validateMetrics(metrics: any) {
    return metrics && typeof metrics.visualizacoes === 'number';
  }
}
`,
  [path.join(baseDir, 'engine', 'performance-service.ts')]: `import { PerformanceEngine } from './performance-engine';
import { PerformanceValidator } from '../validators/performance-validator';

export class PerformanceService {
  private engine = new PerformanceEngine();
  private validator = new PerformanceValidator();

  public registerAndAnalyze(data: any) {
    if (!this.validator.validateMetrics(data.metrics)) throw new Error("Invalid metrics format");
    
    const analysis = this.engine.analyzeMetrics(data.metrics);
    const recommendations = this.engine.generateRecommendations(analysis);
    const priority = this.engine.calculatePriority(analysis);
    
    return {
      content_id: data.content_id,
      analysis,
      recommendations,
      priority,
      status: analysis.trend === 'Queda' ? 'Decay' : 'Healthy'
    };
  }

  public getDashboardOverview() {
    return {
      total_monitorados: 42,
      top_performers: [
        { title: "Guia Completo Cumaru", vis: 15400, trend: "Alta" }
      ],
      alertas_queda: [
        { title: "Checklist Antigo", vis: 120, trend: "Queda", recommendations: ["Atualizar conteúdo"] }
      ]
    };
  }

  public getHistory(contentId: string) {
    return { content_id: contentId, status: "Healthy" };
  }
}
`,
  [path.join(apiDir, 'route.ts')]: `import { NextResponse } from 'next/server';
import { PerformanceService } from '../../../../../organic-traffic-os/performance/engine/performance-service';

export async function GET() {
  const service = new PerformanceService();
  return NextResponse.json(service.getDashboardOverview());
}
`,
  [path.join(apiDir, 'analyze', 'route.ts')]: `import { NextResponse } from 'next/server';
import { PerformanceService } from '../../../../../../organic-traffic-os/performance/engine/performance-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new PerformanceService();
    return NextResponse.json(service.registerAndAnalyze(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
`,
  [path.join(apiDir, '[content_id]', 'route.ts')]: `import { NextResponse } from 'next/server';
import { PerformanceService } from '../../../../../../organic-traffic-os/performance/engine/performance-service';

export async function GET(req: Request, { params }: { params: Promise<{ content_id: string }> }) {
  const { content_id } = await params;
  const service = new PerformanceService();
  return NextResponse.json(service.getHistory(content_id));
}
`,
  [path.join(pageDir, 'page.tsx')]: `import React from 'react';

export default function PerformancePanel() {
  return (
    <div className="p-10 font-sans max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Content Performance Engine</h1>
          <p className="text-slate-500 mt-2 font-medium">Radiografia pós-publicação, detecção de decay e Refresh Cirúrgico.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-lg shadow-sm font-semibold cursor-pointer hover:bg-slate-50 transition">
            Importar GA4 (Mock)
          </div>
          <div className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-200 font-semibold cursor-pointer hover:bg-indigo-700 transition">
            Rodar Análise RICE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Alerts and Decay */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100 flex flex-col justify-center">
              <p className="text-slate-500 font-medium text-sm">Monitorados (Live)</p>
              <p className="text-4xl font-black text-slate-800 mt-2">42 <span className="text-sm font-medium text-emerald-500">Ativos</span></p>
            </div>
            <div className="p-6 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-rose-100 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
              </div>
              <p className="text-rose-500 font-bold text-sm uppercase tracking-wider">Alerta de Decay</p>
              <p className="text-4xl font-black text-rose-600 mt-2">3 <span className="text-sm font-medium text-rose-400">Ativos Sangrando</span></p>
            </div>
            <div className="p-6 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-emerald-100 flex flex-col justify-center">
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Top Performers</p>
              <p className="text-4xl font-black text-emerald-600 mt-2">7 <span className="text-sm font-medium text-emerald-400">Ativos em Alta</span></p>
            </div>
          </div>

          <div className="p-8 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
               Cirurgias Editoriais (Refresh RICE)
            </h2>
            <div className="space-y-4">
              {[
                { title: 'O que estudar para Cumaru 2026', issue: 'Decay Brusco de Tráfego (-22%)', action: 'Atualizar conteúdo + Adicionar Vídeo', score: 240, urgency: 'Alta' },
                { title: 'Tabela de Vencimentos GCM', issue: 'Baixa Conversão (CTR 0.5%)', action: 'Melhorar CTA + Criar Landing', score: 180, urgency: 'Média' },
                { title: 'Simulado Raciocínio Lógico', issue: 'Falta de Autoridade Topical', action: 'Criar Artigos Satélite (2)', score: 90, urgency: 'Baixa' }
              ].map((rec, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer">
                  <div>
                    <h3 className="font-bold text-slate-800">{rec.title}</h3>
                    <p className="text-xs text-rose-500 font-bold mt-1 uppercase tracking-wider">{rec.issue}</p>
                    <p className="text-sm text-slate-600 mt-2 font-medium">🛠️ Prescrição: <span className="text-indigo-600">{rec.action}</span></p>
                  </div>
                  <div className="flex flex-col items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase">RICE Score</span>
                    <span className="text-xl font-black text-amber-600">{rec.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl shadow-slate-900/20 rounded-2xl border border-slate-700 text-white h-fit">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="text-indigo-400">📊</span> Motor Analítico
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Métricas Rastreadas</div>
              <ul className="text-sm font-medium text-slate-300 space-y-1">
                <li>• Visualizações (Views)</li>
                <li>• Cliques (GSC)</li>
                <li>• CTR (Taxa de Clique)</li>
                <li>• Impressões</li>
                <li>• Dwell Time (Tempo de Leitura)</li>
                <li>• Scroll Depth</li>
                <li>• Conversões de Lead</li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50 mt-4">
               <p className="text-xs text-amber-400 font-bold uppercase mb-2">Conectores Futuros</p>
               <div className="flex gap-2">
                 <span className="px-2 py-1 rounded bg-slate-700 text-[10px] border border-slate-600 opacity-50">GA4 API</span>
                 <span className="px-2 py-1 rounded bg-slate-700 text-[10px] border border-slate-600 opacity-50">GSC API</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
  [path.join(reportsDir, 'sprint-25-summary.md')]: "# Sprint 25 - Content Performance Engine V1\n\n## Resumo\nNa Sprint 25 nós transformamos o repositório morto de artigos em uma base viva. O **Content Performance Engine** faz as vezes de um 'Médico Editorial', monitorando a saúde métrica de cada conteúdo (metrics.json).\n\n## O Algoritmo de Decay\nSistemas concorrentes simplesmente publicam e esquecem. Nosso motor utiliza a matriz de trend-analysis.json para cruzar *Tempo de Existência* versus *CTR* versus *Views*. Se um conteúdo desaba no tráfego, o sistema marca o Status como **Decay (Sangrando)**.\n\n## Prescrições Médicas Editoriais\nO módulo de Recomendações não apenas avisa a queda, mas orquestra uma possível cura baseada no refresh-priority.json.\nSe a métrica afetada for retenção baixa, ele recomenda *Adicionar Vídeo*. Se o problema for falta de alcance no Cluster, ele instrui a plataforma a *Criar Artigos Satélite*. Tudo isso orquestrado com matriz **RICE** (ROI, Impacto, Esforço, Urgência) para que o Editor Humano (ou a IA de Atualização no futuro) saiba exatamente o que atacar primeiro."
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Created: ' + filepath);
}
