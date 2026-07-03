const fs = require('fs');
const path = require('path');

const agentDir = path.join(__dirname, 'organic-traffic-os', 'core', 'agents', 'discovery-agent');
const apiRunDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'agents', 'discovery', 'run');
const apiHistDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'agents', 'discovery', 'history');
const pageDir = path.join(__dirname, 'src', 'app', 'organic-os', 'agents', 'discovery');
const reportsDir = path.join(__dirname, 'reports');

[agentDir, apiRunDir, apiHistDir, pageDir, reportsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {

// ─── CSS FIX (Tailwind v4) ────────────────────────────────────────────────────
[path.join(__dirname, 'src', 'app', 'globals.css')]: `@import "tailwindcss";

/* ── ORGANIC OS — DESIGN SYSTEM TOKENS ────────────── */
@theme {
  --color-os-bg:       #0b0e14;
  --color-os-surface:  #111520;
  --color-os-border:   #1d2133;
  --color-os-muted:    #2a2f45;
  --color-os-text:     #e2e8f0;
  --color-os-subtle:   #64748b;
  --color-os-accent:   #6366f1;
  --color-os-accent2:  #818cf8;
  --color-os-success:  #10b981;
  --color-os-warning:  #f59e0b;
  --color-os-danger:   #f43f5e;

  --font-sans: "Inter", "SF Pro Display", system-ui, sans-serif;
}

/* ── GLOBAL RESETS ─────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

html {
  background-color: #0b0e14;
  color: #e2e8f0;
  font-family: "Inter", "SF Pro Display", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  background-color: #0b0e14;
  color: #e2e8f0;
  margin: 0;
  padding: 0;
}

/* ── SCROLLBAR ─────────────────────────────────────── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #2a2f45; border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: #6366f1; }

/* ── GOOGLE FONTS ──────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* ── ANIMATIONS ────────────────────────────────────── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,.3); }
  50%       { box-shadow: 0 0 0 6px rgba(99,102,241,0); }
}
.animate-fade-in-up { animation: fadeInUp 0.4s ease both; }
.animate-pulse-glow { animation: pulse-glow 2s ease infinite; }
`,

// ─── ROOT LAYOUT FIX ─────────────────────────────────────────────────────────
[path.join(__dirname, 'src', 'app', 'layout.tsx')]: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Organic Traffic OS",
  description: "Sistema Operacional de Tráfego Orgânico — Epic 03",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ backgroundColor: "#0b0e14", color: "#e2e8f0", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
`,

// ─── ORGANIC-OS LAYOUT (Premium Sidebar) ─────────────────────────────────────
[path.join(__dirname, 'src', 'app', 'organic-os', 'layout.tsx')]: `import Link from 'next/link';

const menuSections = [
  {
    label: "Intelligence",
    items: [
      { label: 'Inventory Engine',     path: '/organic-os/inventory',         icon: '📦' },
      { label: 'Competitors Intel',    path: '/organic-os/competitors',        icon: '⚔️' },
      { label: 'Keyword Intel',        path: '/organic-os/keywords',           icon: '🔑' },
      { label: 'Search Intelligence',  path: '/organic-os/search',             icon: '📡' },
      { label: 'Research Collectors',  path: '/organic-os/collectors',         icon: '🕸️' },
      { label: 'Opportunity Discovery',path: '/organic-os/opportunities',      icon: '💡' },
    ]
  },
  {
    label: "Planning",
    items: [
      { label: 'Editorial Planning',   path: '/organic-os/editorial',          icon: '📅' },
      { label: 'Brief Intelligence',   path: '/organic-os/briefs',             icon: '📝' },
      { label: 'Blueprints',           path: '/organic-os/blueprints',         icon: '🏗️' },
      { label: 'Research Packs',       path: '/organic-os/research',           icon: '🔬' },
      { label: 'Facts & Sources',      path: '/organic-os/facts',              icon: '📚' },
    ]
  },
  {
    label: "Production",
    items: [
      { label: 'Strategy Engine',      path: '/organic-os/strategy',           icon: '🎯' },
      { label: 'Draft Writer',         path: '/organic-os/drafts',             icon: '✍️' },
      { label: 'Quality Review',       path: '/organic-os/quality',            icon: '⚖️' },
      { label: 'Audience Adaptation',  path: '/organic-os/audience',           icon: '🎭' },
      { label: 'Natural Language',     path: '/organic-os/natural-language',   icon: '✨' },
      { label: 'Visibility Engine',    path: '/organic-os/visibility',         icon: '👁️' },
      { label: 'Asset Library',        path: '/organic-os/assets',             icon: '💎' },
    ]
  },
  {
    label: "Operations",
    items: [
      { label: 'Publishing Engine',    path: '/organic-os/publishing',         icon: '🚀' },
      { label: 'Performance Engine',   path: '/organic-os/performance',        icon: '📈' },
      { label: 'E2E Validation',       path: '/organic-os/e2e',                icon: '🧪' },
      { label: 'Workflows',            path: '/organic-os/workflows',          icon: '🔄' },
    ]
  },
  {
    label: "Agents — Epic 03",
    items: [
      { label: 'Discovery Agent',      path: '/organic-os/agents/discovery',   icon: '🤖' },
      { label: 'Core Architecture',    path: '/organic-os/architecture',       icon: '🏛️' },
      { label: 'System Health',        path: '/organic-os/health',             icon: '🛡️' },
    ]
  }
];

export default function OrganicOSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0b0e14', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>
      
      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '260px', minWidth: '260px',
        backgroundColor: '#0e1119',
        borderRight: '1px solid #1d2133',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #1d2133' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '900', color: '#fff',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
            }}>OS</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '-0.3px' }}>
                Organic Traffic OS
              </div>
              <div style={{ fontSize: '10px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '1px' }}>
                Epic 03 Active
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          {menuSections.map(section => (
            <div key={section.label} style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '9px', fontWeight: '700', color: '#3d4461',
                textTransform: 'uppercase', letterSpacing: '1.2px',
                padding: '0 10px', marginBottom: '6px'
              }}>{section.label}</div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {section.items.map(item => (
                  <li key={item.path}>
                    <Link href={item.path} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '7px 10px', borderRadius: '8px',
                      fontSize: '13px', fontWeight: '500', color: '#8892b0',
                      textDecoration: 'none', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = 'rgba(99,102,241,0.1)';
                      el.style.color = '#a5b4fc';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.backgroundColor = 'transparent';
                      el.style.color = '#8892b0';
                    }}>
                      <span style={{ fontSize: '14px', opacity: 0.7 }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid #1d2133',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '11px', color: '#3d4461', fontFamily: 'monospace' }}>v3.0.0</span>
          <span style={{
            fontSize: '10px', color: '#6366f1', fontWeight: '600',
            background: 'rgba(99,102,241,0.1)', padding: '2px 8px',
            borderRadius: '4px', border: '1px solid rgba(99,102,241,0.2)'
          }}>EPIC 03</span>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#0b0e14', position: 'relative' }}>
        {children}
      </main>
    </div>
  );
}
`,

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────
[path.join(__dirname, 'src', 'app', 'organic-os', 'page.tsx')]: `export default function OrganicOSDashboard() {
  return (
    <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#e2e8f0', margin: 0, letterSpacing: '-1px' }}>
          Organic Traffic <span style={{ color: '#6366f1' }}>OS</span>
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '16px', fontWeight: '500' }}>
          Sistema Operacional de Tráfego Orgânico — Epic 03 Active
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total de Engines', value: '23', color: '#6366f1', icon: '⚡' },
          { label: 'Total de Rotas API', value: '97', color: '#10b981', icon: '🔗' },
          { label: 'Health Score', value: '100%', color: '#f59e0b', icon: '🛡️' },
          { label: 'Architecture', value: 'v3.0', color: '#818cf8', icon: '🏛️' },
          { label: 'Agents', value: '1', color: '#f43f5e', icon: '🤖' },
          { label: 'Epic', value: '03', color: '#6366f1', icon: '🚀' },
        ].map((card, i) => (
          <div key={i} style={{
            backgroundColor: '#0e1119', border: '1px solid #1d2133',
            borderRadius: '16px', padding: '24px',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
`,

// ─── DISCOVERY AGENT TYPES ───────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.types.ts')]: `export type DiscoveryMode = 'manual' | 'mock' | 'pipeline';
export type OpportunityType = 'article' | 'faq' | 'guide' | 'landing-page' | 'checklist' | 'glossary' | 'timeline' | 'comparison' | 'ebook' | 'newsletter';
export type OpportunityPriority = 'critical' | 'high' | 'medium' | 'low';

export interface DiscoveryInput {
  blog_id: string;
  topic: string;
  mode: DiscoveryMode;
  limit: number;
}

export interface DiscoveryOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  category: string;
  cluster: string;
  intent: string;
  priority: OpportunityPriority;
  score: number;
  reason: string;
  source: string;
  confidence: number;
  next_step: string;
}

export interface DiscoverySummary {
  total_found: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  avg_score: number;
  top_cluster: string;
}

export interface DiscoveryReport {
  agent: string;
  blog_id: string;
  topic: string;
  opportunities: DiscoveryOpportunity[];
  summary: DiscoverySummary;
  warnings: string[];
  created_at: string;
}
`,

// ─── MANIFEST ────────────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.manifest.json')]: JSON.stringify({
  id: "discovery-agent",
  name: "Discovery Agent",
  version: "1.0.0",
  layer: "agents",
  category: "discovery",
  description: "Agente autônomo responsável por descobrir e priorizar oportunidades editoriais com base no inventário, keywords e dados de performance existentes.",
  inputs: { blog_id: "string", topic: "string", mode: "manual|mock|pipeline", limit: "number" },
  outputs: { opportunities: "DiscoveryOpportunity[]", summary: "DiscoverySummary", warnings: "string[]" },
  dependencies: { layers: ["knowledge", "engines", "connectors"], engines: ["inventory", "keywords", "opportunities", "performance"] },
  required_knowledge: ["blog-context", "niche-rules"],
  required_engines: ["opportunity-engine", "keyword-engine"],
  required_connectors: ["mock-connector", "manual-connector"],
  status: "active"
}, null, 2),

// ─── RULES ───────────────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.rules.json')]: JSON.stringify({
  priorizar: [
    "Conteúdo com alta intenção educacional (como estudar, o que é, como funciona)",
    "Concursos municipais e estaduais (prefeituras, câmaras, autarquias)",
    "Temas ligados à banca IVIN e bancas regionais",
    "Lacunas no inventário atual (temas sem cobertura)",
    "Perguntas recorrentes de candidatos (FAQ, dúvidas frequentes)",
    "Conteúdos com potencial de captura de lead (e-book, checklist, simulado)",
    "Conteúdos evergreen com baixa concorrência e alta intenção",
    "Guias para candidatos iniciantes"
  ],
  evitar: [
    "Temas duplicados já presentes no inventário",
    "Temas fora do nicho de concursos públicos municipais",
    "Promessa de aprovação ou garantia de resultado",
    "Dados sem fonte verificável",
    "Conteúdo sensacionalista ou clickbait",
    "Cargos ou editais não confirmados"
  ],
  scoring: {
    intencao_alta: 30,
    lacuna_inventario: 25,
    potencial_lead: 20,
    evergreen: 15,
    nicho_especifico: 10
  }
}, null, 2),

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.prompts.md')]: `# Discovery Agent — Prompts

## Discovery Prompt
Analise o blog {blog_id} focado no tema "{topic}".
Identifique oportunidades editoriais com base nas regras do nicho.
Gere oportunidades classificadas por prioridade.

## Scoring Prompt
Para cada oportunidade, calcule o score com base em:
- Intenção de busca (educacional/transacional/navegacional)
- Lacuna no inventário existente
- Potencial de captura de lead
- Volume de busca estimado
- Concorrência existente
`,

// ─── VALIDATOR ───────────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.validator.ts')]: `import { DiscoveryInput } from './discovery-agent.types';

export class DiscoveryAgentValidator {
  validate(input: DiscoveryInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.topic?.trim()) errors.push('topic é obrigatório');
    if (!['manual', 'mock', 'pipeline'].includes(input.mode)) errors.push('mode deve ser manual, mock ou pipeline');
    if (!input.limit || input.limit < 1 || input.limit > 100) errors.push('limit deve ser entre 1 e 100');
    return { valid: errors.length === 0, errors };
  }
}
`,

// ─── REPORT TEMPLATE ─────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.report-template.json')]: JSON.stringify({
  agent: "discovery-agent",
  blog_id: "",
  topic: "",
  opportunities: [],
  summary: { total_found: 0, critical: 0, high: 0, medium: 0, low: 0, avg_score: 0, top_cluster: "" },
  warnings: [],
  created_at: ""
}, null, 2),

// ─── CORE AGENT ──────────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.ts')]: `import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { DiscoveryInput, DiscoveryReport } from './discovery-agent.types';
import { DiscoveryAgentService } from './discovery-agent.service';

export class DiscoveryAgent implements BaseAgent {
  id = 'discovery-agent';
  name = 'Discovery Agent';
  version = '1.0.0';

  private service = new DiscoveryAgentService();

  async execute(task: DiscoveryInput, ctx: AgentContext): Promise<AgentResult<DiscoveryReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runDiscovery(task);
      return {
        success: true,
        data: report,
        durationMs: Date.now() - startedAt
      };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: DiscoveryInput): boolean {
    return !!task.blog_id && !!task.topic;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
`,

// ─── SERVICE ─────────────────────────────────────────────────────────────────
[path.join(agentDir, 'discovery-agent.service.ts')]: `import {
  DiscoveryInput, DiscoveryOpportunity, DiscoveryReport, DiscoverySummary
} from './discovery-agent.types';
import { DiscoveryAgentValidator } from './discovery-agent.validator';

const MOCK_OPPORTUNITIES: Omit<DiscoveryOpportunity, 'id'>[] = [
  {
    title: 'Como Estudar para Concurso da Prefeitura de Cumaru do Norte',
    type: 'guide', category: 'Estudo', cluster: 'Concurso Cumaru',
    intent: 'educacional', priority: 'critical', score: 95,
    reason: 'Alta intenção educacional + Lacuna no inventário + Potencial de captura de lead',
    source: 'mock', confidence: 0.92,
    next_step: 'Criar brief e blueprint imediatamente'
  },
  {
    title: 'Edital do Concurso Prefeitura de Cumaru do Norte — Análise Completa',
    type: 'article', category: 'Edital', cluster: 'Concurso Cumaru',
    intent: 'informacional', priority: 'critical', score: 93,
    reason: 'Pergunta mais buscada no nicho + Zero concorrência local',
    source: 'mock', confidence: 0.90,
    next_step: 'Aguardar publicação do edital oficial para confirmar dados'
  },
  {
    title: 'Cargos e Salários do Concurso de Cumaru — Tabela Atualizada',
    type: 'comparison', category: 'Cargos', cluster: 'Concurso Cumaru',
    intent: 'informacional', priority: 'high', score: 88,
    reason: 'Alta demanda por dados concretos + Conteúdo evergreen',
    source: 'mock', confidence: 0.85,
    next_step: 'Criar tabela comparativa com cargos disponíveis'
  },
  {
    title: 'Banca IVIN — Perfil Completo e Estilo de Questões',
    type: 'guide', category: 'Banca', cluster: 'Banca IVIN',
    intent: 'educacional', priority: 'high', score: 85,
    reason: 'Diferencial editorial + Lacuna no mercado + Potencial de tráfego long tail',
    source: 'mock', confidence: 0.88,
    next_step: 'Coletar questões das últimas provas da IVIN'
  },
  {
    title: 'Simulado IVIN — 40 Questões de Legislação Municipal',
    type: 'article', category: 'Simulado', cluster: 'Banca IVIN',
    intent: 'educacional', priority: 'high', score: 82,
    reason: 'Alta retenção + Potencial de assinatura + Engajamento comprovado no nicho',
    source: 'mock', confidence: 0.80,
    next_step: 'Elaborar simulado com gabarito e explicações'
  },
  {
    title: 'Lei Orgânica Municipal — Resumo Para Concursos',
    type: 'guide', category: 'Legislação', cluster: 'Direito Municipal',
    intent: 'educacional', priority: 'high', score: 80,
    reason: 'Conteúdo evergreen + Presente em todos os editais municipais',
    source: 'mock', confidence: 0.82,
    next_step: 'Criar guia com os pontos mais cobrados em provas'
  },
  {
    title: 'Checklist de Documentos para Posse em Concurso Municipal',
    type: 'checklist', category: 'Pós-aprovação', cluster: 'Concurso Municipal',
    intent: 'transacional', priority: 'medium', score: 72,
    reason: 'Conteúdo de cauda longa + Alto valor percebido + Potencial de lead',
    source: 'mock', confidence: 0.75,
    next_step: 'Criar checklist em formato PDF para captura de email'
  },
  {
    title: 'E-book Gratuito — Guia do Candidato Iniciante em Concursos Municipais',
    type: 'ebook', category: 'Lead Magnet', cluster: 'Iniciantes',
    intent: 'transacional', priority: 'medium', score: 70,
    reason: 'Potencial de captura de lead + Conteúdo de alta retenção',
    source: 'mock', confidence: 0.70,
    next_step: 'Estruturar e-book de 20 páginas com guia completo'
  },
];

export class DiscoveryAgentService {
  private validator = new DiscoveryAgentValidator();

  validateInput(input: DiscoveryInput): { valid: boolean; errors: string[] } {
    return this.validator.validate(input);
  }

  generateOpportunities(input: DiscoveryInput): DiscoveryOpportunity[] {
    const base = MOCK_OPPORTUNITIES.map((o, i) => ({ id: \`opp-\${Date.now()}-\${i}\`, ...o }));
    return base.slice(0, input.limit);
  }

  scoreOpportunities(opps: DiscoveryOpportunity[]): DiscoveryOpportunity[] {
    return opps.sort((a, b) => b.score - a.score);
  }

  buildSummary(opps: DiscoveryOpportunity[]): DiscoverySummary {
    const avg = opps.reduce((acc, o) => acc + o.score, 0) / (opps.length || 1);
    const clusters = opps.reduce((acc: Record<string,number>, o) => {
      acc[o.cluster] = (acc[o.cluster] || 0) + 1; return acc;
    }, {});
    const topCluster = Object.entries(clusters).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    return {
      total_found: opps.length,
      critical: opps.filter(o => o.priority === 'critical').length,
      high: opps.filter(o => o.priority === 'high').length,
      medium: opps.filter(o => o.priority === 'medium').length,
      low: opps.filter(o => o.priority === 'low').length,
      avg_score: Math.round(avg),
      top_cluster: topCluster
    };
  }

  generateReport(input: DiscoveryInput, opps: DiscoveryOpportunity[]): DiscoveryReport {
    return {
      agent: 'discovery-agent',
      blog_id: input.blog_id,
      topic: input.topic,
      opportunities: opps,
      summary: this.buildSummary(opps),
      warnings: ['Dados baseados em mock. Conectar GSC para dados reais no próximo sprint.'],
      created_at: new Date().toISOString()
    };
  }

  async runDiscovery(input: DiscoveryInput): Promise<DiscoveryReport> {
    const validation = this.validateInput(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));
    const raw = this.generateOpportunities(input);
    const scored = this.scoreOpportunities(raw);
    return this.generateReport(input, scored);
  }
}
`,

// ─── API: RUN ─────────────────────────────────────────────────────────────────
[path.join(apiRunDir, 'route.ts')]: `import { NextRequest, NextResponse } from 'next/server';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const service = new DiscoveryAgentService();
    const report = await service.runDiscovery({
      blog_id: body.blog_id || 'passacumaru',
      topic: body.topic || 'Concurso Prefeitura de Cumaru do Norte',
      mode: body.mode || 'mock',
      limit: body.limit || 10,
    });
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
`,

// ─── API: HISTORY ─────────────────────────────────────────────────────────────
[path.join(apiHistDir, 'route.ts')]: `import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 'run-001', blog_id: 'passacumaru', topic: 'Concurso Prefeitura de Cumaru do Norte', opportunities_found: 8, avg_score: 82, ran_at: new Date().toISOString() }
  ]);
}
`,

// ─── UI PANEL ─────────────────────────────────────────────────────────────────
[path.join(pageDir, 'page.tsx')]: `"use client";
import React, { useState } from 'react';

const card = (style?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '16px',
  padding: '24px', ...style
});

const badge = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
  borderRadius: '999px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.4px',
  backgroundColor: color + '18', color: color, border: \`1px solid \${color}30\`
});

const priorityColor: Record<string,string> = {
  critical: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#64748b'
};

export default function DiscoveryAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [mode, setMode] = useState('mock');
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/discovery/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic, mode, limit })
      });
      const data = await res.json();
      setReport(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  const input: React.CSSProperties = {
    backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '8px',
    padding: '10px 14px', color: '#e2e8f0', fontSize: '14px', width: '100%',
    outline: 'none', fontFamily: 'inherit'
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            🤖 Discovery Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
            Primeiro agente autônomo do Epic 03 — detecta oportunidades editoriais priorizadas.
          </p>
        </div>
        <div style={{ ...badge('#10b981') as any, fontSize: '12px', padding: '6px 14px' }}>
          v1.0.0 — ACTIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <div style={card()}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 20px' }}>
            Configurar Execução
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Blog ID</label>
              <input style={input} value={blogId} onChange={e => setBlogId(e.target.value)} placeholder="passacumaru" />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Topic</label>
              <input style={input} value={topic} onChange={e => setTopic(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mode</label>
              <select style={input} value={mode} onChange={e => setMode(e.target.value)}>
                <option value="mock">Mock (Dados Simulados)</option>
                <option value="manual">Manual (CSV)</option>
                <option value="pipeline">Pipeline</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Limit ({limit})</label>
              <input style={input} type="range" min={1} max={20} value={limit} onChange={e => setLimit(+e.target.value)} />
            </div>
            <button
              onClick={run}
              disabled={loading}
              style={{
                marginTop: '8px', width: '100%', padding: '12px',
                background: loading ? '#1d2133' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                border: 'none', borderRadius: '10px', color: '#fff',
                fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.3px', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)'
              }}>
              {loading ? '⚡ Analisando...' : '🚀 Executar Discovery'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {!report && !loading && (
            <div style={{ ...card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🤖</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Discovery Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>Os resultados aparecerão aqui</div>
            </div>
          )}

          {report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                  { label: 'Total', value: report.summary.total_found, color: '#6366f1' },
                  { label: 'Critical', value: report.summary.critical, color: '#f43f5e' },
                  { label: 'High', value: report.summary.high, color: '#f59e0b' },
                  { label: 'Avg Score', value: report.summary.avg_score, color: '#10b981' },
                ].map((s, i) => (
                  <div key={i} style={{ ...card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Opportunities List */}
              <div style={card()}>
                <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 20px' }}>
                  Oportunidades Descobertas ({report.opportunities.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {report.opportunities.map((opp: any, i: number) => (
                    <div key={i} style={{
                      backgroundColor: '#080b10', border: '1px solid #1d2133',
                      borderRadius: '12px', padding: '16px 20px',
                      borderLeft: \`3px solid \${priorityColor[opp.priority]}\`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                            {opp.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>{opp.reason}</div>
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
                            <span style={badge(priorityColor[opp.priority])}>{opp.priority}</span>
                            <span style={badge('#64748b')}>{opp.type}</span>
                            <span style={badge('#818cf8')}>{opp.cluster}</span>
                          </div>
                          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6366f1', fontWeight: '600' }}>
                            → {opp.next_step}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '60px' }}>
                          <div style={{ fontSize: '28px', fontWeight: '900', color: opp.score >= 90 ? '#10b981' : opp.score >= 75 ? '#f59e0b' : '#64748b' }}>
                            {opp.score}
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>SCORE</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warnings */}
              {report.warnings.length > 0 && (
                <div style={{ ...card({ borderColor: '#f59e0b30', borderLeft: '3px solid #f59e0b', padding: '16px 20px' }) }}>
                  {report.warnings.map((w: string, i: number) => (
                    <div key={i} style={{ fontSize: '13px', color: '#f59e0b', display: 'flex', gap: '8px' }}>
                      <span>⚠️</span><span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
`,

// ─── REPORT ──────────────────────────────────────────────────────────────────
[path.join(reportsDir, 'sprint-26-2-summary.md')]: `# Sprint 26.2 — Discovery Agent V1

## O que foi criado
O primeiro agente autônomo do Organic Traffic OS.

## Arquivos do Agente
- \`discovery-agent.ts\`: Classe principal implementando \`BaseAgent\`
- \`discovery-agent.manifest.json\`: Metadados e dependências
- \`discovery-agent.types.ts\`: Tipagem forte de input/output
- \`discovery-agent.rules.json\`: Regras de priorização do nicho PassaCumaru
- \`discovery-agent.validator.ts\`: Validação de input
- \`discovery-agent.service.ts\`: Orquestração do processo completo
- \`discovery-agent.report-template.json\`: Estrutura do relatório

## Como Funciona (5 Camadas)
Layer 1 (Connectors) → Mock/Manual fornece dados
Layer 2 (Knowledge) → Contexto do blog e regras do nicho
Layer 3 (Engines) → Score e classificação das oportunidades
Layer 4 (Agents) → DiscoveryAgent orquestra o fluxo
Layer 5 (Workflows) → Preparado para chamada em pipeline futuro

## Limitações Atuais
- Dados baseados em mock (GSC real nas próximas Sprints)
- Sem integração com APIs externas

## Próximos Passos
- Sprint 26.3: Conectar GSC Connector real
- Sprint 26.4: Criar Content Writer Agent
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('✓ ' + path.relative(__dirname, filepath));
}
