const fs = require('fs');
const path = require('path');

const agentDir = path.join(__dirname, 'organic-traffic-os', 'core', 'agents', 'planning-agent');
const apiRunDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'agents', 'planning', 'run');
const apiHistDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'agents', 'planning', 'history');
const apiBacklogDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'agents', 'planning', 'backlog');
const apiCalendarDir = path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'agents', 'planning', 'calendar');
const pageDir = path.join(__dirname, 'src', 'app', 'organic-os', 'agents', 'planning');
const reportsDir = path.join(__dirname, 'reports');

[agentDir, apiRunDir, apiHistDir, apiBacklogDir, apiCalendarDir, pageDir, reportsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {

// ─── TYPES ─────────────────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.types.ts')]: `import { DiscoveryReport } from '../discovery-agent/discovery-agent.types';

export interface PlanningInput {
  blog_id: string;
  discovery_report: DiscoveryReport;
  start_date: string;
  weeks: number;
}

export type BacklogStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type ContentPriority = 'critical' | 'high' | 'medium' | 'low';

export interface BacklogItem {
  id: string;
  titulo: string;
  tipo: string;
  cluster: string;
  categoria: string;
  prioridade: ContentPriority;
  score: number;
  status: BacklogStatus;
  dependencias: string[];
  estimativa_dias: number;
  responsavel: string;
  origem: string;
  score_impacto: number;
  score_urgencia: number;
  score_roi: number;
  score_facilidade: number;
}

export interface CalendarEntry {
  id: string;
  data_prevista: string;
  titulo: string;
  tipo: string;
  cluster: string;
  prioridade: ContentPriority;
  status: BacklogStatus;
  observacoes: string;
}

export interface Roadmap {
  blog_id: string;
  semanas_totais: number;
  total_itens: number;
  clusters: string[];
  fases: RoadmapPhase[];
}

export interface RoadmapPhase {
  fase: number;
  nome: string;
  semana_inicio: number;
  semana_fim: number;
  itens: BacklogItem[];
}

export interface PlanningReport {
  agent: string;
  blog_id: string;
  backlog: BacklogItem[];
  calendar: CalendarEntry[];
  roadmap: Roadmap;
  summary: PlanningS ummary;
  warnings: string[];
  created_at: string;
}

export interface PlanningSummary {
  total_oportunidades: number;
  duplicatas_removidas: number;
  clusters_identificados: number;
  itens_backlog: number;
  semanas_estimadas: number;
  criticos: number;
  altos: number;
  medios: number;
}
`,

// ─── MANIFEST ──────────────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.manifest.json')]: JSON.stringify({
  id: "planning-agent",
  name: "Planning Agent",
  version: "1.0.0",
  layer: "agents",
  category: "planning",
  description: "Agente autônomo responsável por transformar oportunidades editoriais em um plano editorial executável, com backlog priorizado, calendário e roadmap de produção.",
  inputs: ["DiscoveryReport", "blog_id", "start_date", "weeks"],
  outputs: ["BacklogItem[]", "CalendarEntry[]", "Roadmap", "PlanningSummary"],
  required_engines: ["opportunity-engine", "editorial-engine"],
  required_workflows: ["editorial-workflow"],
  dependencies: { agents: ["discovery-agent"], layers: ["knowledge", "engines"] },
  status: "active"
}, null, 2),

// ─── RULES ─────────────────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.rules.json')]: JSON.stringify({
  dependencias_obrigatorias: [
    { tipo_filho: "faq", requer: "article", descricao: "FAQ só após artigo principal" },
    { tipo_filho: "article-satelite", requer: "pillar-page", descricao: "Satélite só após Página Pilar" },
    { tipo_filho: "quiz", requer: "article", descricao: "Quiz só após conteúdo base" },
    { tipo_filho: "landing-page", requer: "article", descricao: "Landing só após conteúdo principal" },
    { tipo_filho: "checklist", requer: "guide", descricao: "Checklist só após guia completo" }
  ],
  prioridade_clusters: [
    "Concurso Cumaru",
    "Banca IVIN",
    "Direito Municipal",
    "Legislação",
    "Iniciantes"
  ],
  scores: {
    impacto: { peso: 0.30 },
    urgencia: { peso: 0.25 },
    roi: { peso: 0.20 },
    autoridade: { peso: 0.15 },
    facilidade: { peso: 0.10 }
  },
  cadencia_semanal: 3,
  estimativa_dias_por_tipo: {
    "article": 2,
    "guide": 3,
    "faq": 1,
    "checklist": 1,
    "landing-page": 4,
    "ebook": 7,
    "comparison": 2,
    "timeline": 2,
    "glossary": 2
  }
}, null, 2),

// ─── PROMPTS ───────────────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.prompts.md')]: `# Planning Agent — Prompts

## Prioritization Prompt
Analise as oportunidades do blog {blog_id}.
Aplique os pesos de priorização: Impacto (30%), Urgência (25%), ROI (20%), Autoridade (15%), Facilidade (10%).
Retorne o backlog ordenado pelo score composto.

## Dependency Prompt
Para cada item do backlog, verifique as dependências obrigatórias:
- FAQ requer artigo principal do mesmo cluster
- Satélite requer Página Pilar
- Quiz requer conteúdo base
- Landing requer conteúdo principal

## Calendar Prompt
Distribua os itens do backlog em {weeks} semanas com cadência de {cadencia} itens/semana.
Respeite as dependências (o item pai deve sempre preceder o filho).
`,

// ─── VALIDATOR ─────────────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.validator.ts')]: `import { PlanningInput } from './planning-agent.types';

export class PlanningAgentValidator {
  validate(input: PlanningInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.discovery_report) errors.push('discovery_report é obrigatório');
    if (!input.start_date) errors.push('start_date é obrigatório');
    if (!input.weeks || input.weeks < 1 || input.weeks > 52) errors.push('weeks deve ser entre 1 e 52');
    if (input.discovery_report?.opportunities?.length === 0) errors.push('Nenhuma oportunidade para planejar');
    return { valid: errors.length === 0, errors };
  }
}
`,

// ─── REPORT TEMPLATE ───────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.report-template.json')]: JSON.stringify({
  agent: "planning-agent",
  blog_id: "",
  backlog: [],
  calendar: [],
  roadmap: { blog_id: "", semanas_totais: 0, total_itens: 0, clusters: [], fases: [] },
  summary: { total_oportunidades: 0, duplicatas_removidas: 0, clusters_identificados: 0, itens_backlog: 0, semanas_estimadas: 0, criticos: 0, altos: 0, medios: 0 },
  warnings: [],
  created_at: ""
}, null, 2),

// ─── SERVICE ───────────────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.service.ts')]: `import { PlanningInput, BacklogItem, CalendarEntry, PlanningReport, Roadmap, RoadmapPhase, PlanningSummary, ContentPriority } from './planning-agent.types';
import { PlanningAgentValidator } from './planning-agent.validator';
import { DiscoveryOpportunity } from '../discovery-agent/discovery-agent.types';

const CADENCIA = 3;
const ESTIMATIVA: Record<string, number> = {
  article: 2, guide: 3, faq: 1, checklist: 1,
  "landing-page": 4, ebook: 7, comparison: 2, timeline: 2, glossary: 2
};

const DEPENDENCY_RULES: Record<string, string> = {
  faq: 'article', 'article-satelite': 'pillar-page',
  quiz: 'article', 'landing-page': 'article', checklist: 'guide'
};

export class PlanningAgentService {
  private validator = new PlanningAgentValidator();

  analyzeOpportunities(opps: DiscoveryOpportunity[]): DiscoveryOpportunity[] {
    const seen = new Set<string>();
    return opps.filter(o => {
      const key = o.cluster + '|' + o.type;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  mergeDuplicates(opps: DiscoveryOpportunity[]): { unique: DiscoveryOpportunity[]; removed: number } {
    const original = opps.length;
    const unique = this.analyzeOpportunities(opps);
    return { unique, removed: original - unique.length };
  }

  calculatePriority(opp: DiscoveryOpportunity): { impacto: number; urgencia: number; roi: number; facilidade: number } {
    const base = opp.score;
    return {
      impacto: Math.min(100, Math.round(base * 1.1)),
      urgencia: opp.priority === 'critical' ? 95 : opp.priority === 'high' ? 75 : opp.priority === 'medium' ? 50 : 25,
      roi: Math.round(base * 0.9),
      facilidade: ESTIMATIVA[opp.type] <= 2 ? 80 : ESTIMATIVA[opp.type] <= 3 ? 60 : 40
    };
  }

  groupByCluster(opps: DiscoveryOpportunity[]): Record<string, DiscoveryOpportunity[]> {
    return opps.reduce((acc, o) => {
      if (!acc[o.cluster]) acc[o.cluster] = [];
      acc[o.cluster].push(o);
      return acc;
    }, {} as Record<string, DiscoveryOpportunity[]>);
  }

  generateBacklog(opps: DiscoveryOpportunity[]): BacklogItem[] {
    const { unique } = this.mergeDuplicates(opps);
    const items: BacklogItem[] = unique.map((opp, i) => {
      const scores = this.calculatePriority(opp);
      const composite = Math.round(
        scores.impacto * 0.30 + scores.urgencia * 0.25 +
        scores.roi * 0.20 + 70 * 0.15 + scores.facilidade * 0.10
      );
      const deps = DEPENDENCY_RULES[opp.type] ? [`\${DEPENDENCY_RULES[opp.type]}-\${opp.cluster.toLowerCase().replace(/\\s/g, '-')}`] : [];
      return {
        id: \`backlog-\${i + 1}-\${Date.now()}\`,
        titulo: opp.title,
        tipo: opp.type,
        cluster: opp.cluster,
        categoria: opp.category,
        prioridade: opp.priority as ContentPriority,
        score: composite,
        status: 'pending' as const,
        dependencias: deps,
        estimativa_dias: ESTIMATIVA[opp.type] || 2,
        responsavel: 'equipe-editorial',
        origem: 'discovery-agent',
        score_impacto: scores.impacto,
        score_urgencia: scores.urgencia,
        score_roi: scores.roi,
        score_facilidade: scores.facilidade
      };
    });
    return items.sort((a, b) => b.score - a.score);
  }

  generateCalendar(backlog: BacklogItem[], startDate: string, weeks: number): CalendarEntry[] {
    const calendar: CalendarEntry[] = [];
    const start = new Date(startDate);
    let slotIndex = 0;

    for (const item of backlog) {
      if (slotIndex >= weeks * CADENCIA) break;
      const weekOffset = Math.floor(slotIndex / CADENCIA);
      const dayOffset = (slotIndex % CADENCIA) * 2;
      const date = new Date(start);
      date.setDate(date.getDate() + weekOffset * 7 + dayOffset);

      calendar.push({
        id: \`cal-\${slotIndex + 1}\`,
        data_prevista: date.toISOString().split('T')[0],
        titulo: item.titulo,
        tipo: item.tipo,
        cluster: item.cluster,
        prioridade: item.prioridade,
        status: 'pending',
        observacoes: item.dependencias.length > 0 ? \`Depende de: \${item.dependencias.join(', ')}\` : ''
      });
      slotIndex++;
    }
    return calendar;
  }

  buildRoadmap(backlog: BacklogItem[], weeks: number): Roadmap {
    const clusters = [...new Set(backlog.map(b => b.cluster))];
    const itemsPerPhase = Math.ceil(backlog.length / 3);
    const fases: RoadmapPhase[] = [
      { fase: 1, nome: 'Fundação (Pilares)', semana_inicio: 1, semana_fim: Math.ceil(weeks / 3), itens: backlog.slice(0, itemsPerPhase).filter(b => ['guide', 'article'].includes(b.tipo)) },
      { fase: 2, nome: 'Expansão (Clusters)', semana_inicio: Math.ceil(weeks / 3) + 1, semana_fim: Math.ceil(weeks * 2 / 3), itens: backlog.slice(itemsPerPhase, itemsPerPhase * 2) },
      { fase: 3, nome: 'Conversão (Leads)', semana_inicio: Math.ceil(weeks * 2 / 3) + 1, semana_fim: weeks, itens: backlog.slice(itemsPerPhase * 2).filter(b => ['ebook', 'checklist', 'landing-page'].includes(b.tipo)) }
    ];
    return { blog_id: '', semanas_totais: weeks, total_itens: backlog.length, clusters, fases };
  }

  calculateScores(backlog: BacklogItem[]): PlanningSummary {
    return {
      total_oportunidades: backlog.length,
      duplicatas_removidas: 0,
      clusters_identificados: [...new Set(backlog.map(b => b.cluster))].length,
      itens_backlog: backlog.length,
      semanas_estimadas: Math.ceil(backlog.length / CADENCIA),
      criticos: backlog.filter(b => b.prioridade === 'critical').length,
      altos: backlog.filter(b => b.prioridade === 'high').length,
      medios: backlog.filter(b => b.prioridade === 'medium').length
    };
  }

  async runPlanning(input: PlanningInput): Promise<PlanningReport> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const opps = input.discovery_report.opportunities;
    const { removed } = this.mergeDuplicates(opps);
    const backlog = this.generateBacklog(opps);
    const calendar = this.generateCalendar(backlog, input.start_date, input.weeks);
    const roadmap = { ...this.buildRoadmap(backlog, input.weeks), blog_id: input.blog_id };
    const summary = { ...this.calculateScores(backlog), duplicatas_removidas: removed };
    const warnings: string[] = [
      'Calendário baseado em dados mock. Conectar GSC para dados reais.',
      'Dependências calculadas por tipo — revisar manualmente para casos especiais.'
    ];

    return {
      agent: 'planning-agent',
      blog_id: input.blog_id,
      backlog,
      calendar,
      roadmap,
      summary,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  async updateBacklog(): Promise<BacklogItem[]> { return []; }
  async updateCalendar(): Promise<CalendarEntry[]> { return []; }
  async buildRoadmapStandalone(): Promise<Roadmap> {
    return { blog_id: '', semanas_totais: 0, total_itens: 0, clusters: [], fases: [] };
  }
}
`,

// ─── MAIN AGENT CLASS ──────────────────────────────────────────────────────
[path.join(agentDir, 'planning-agent.ts')]: `import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { PlanningInput, PlanningReport } from './planning-agent.types';
import { PlanningAgentService } from './planning-agent.service';

export class PlanningAgent implements BaseAgent {
  id = 'planning-agent';
  name = 'Planning Agent';
  version = '1.0.0';
  private service = new PlanningAgentService();

  async execute(task: PlanningInput, ctx: AgentContext): Promise<AgentResult<PlanningReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runPlanning(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: PlanningInput): boolean {
    return !!task.blog_id && !!task.discovery_report;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
`,

// ─── API: RUN ──────────────────────────────────────────────────────────────
[path.join(apiRunDir, 'route.ts')]: `import { NextRequest, NextResponse } from 'next/server';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const blog_id = body.blog_id || 'passacumaru';

    // Auto-run discovery if no report provided
    let discovery_report = body.discovery_report;
    if (!discovery_report) {
      const dService = new DiscoveryAgentService();
      discovery_report = await dService.runDiscovery({
        blog_id, topic: body.topic || 'Concurso Prefeitura de Cumaru do Norte',
        mode: 'mock', limit: body.limit || 10
      });
    }

    const service = new PlanningAgentService();
    const report = await service.runPlanning({
      blog_id,
      discovery_report,
      start_date: body.start_date || new Date().toISOString().split('T')[0],
      weeks: body.weeks || 8
    });
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
`,

// ─── API: HISTORY ──────────────────────────────────────────────────────────
[path.join(apiHistDir, 'route.ts')]: `import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 'plan-001', blog_id: 'passacumaru', itens_backlog: 8, semanas: 8, ran_at: new Date().toISOString() }
  ]);
}
`,

// ─── API: BACKLOG ──────────────────────────────────────────────────────────
[path.join(apiBacklogDir, 'route.ts')]: `import { NextResponse } from 'next/server';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';
export async function GET() {
  const dService = new DiscoveryAgentService();
  const discovery = await dService.runDiscovery({ blog_id: 'passacumaru', topic: 'Concurso Cumaru', mode: 'mock', limit: 10 });
  const pService = new PlanningAgentService();
  const backlog = pService.generateBacklog(discovery.opportunities);
  return NextResponse.json(backlog);
}
`,

// ─── API: CALENDAR ─────────────────────────────────────────────────────────
[path.join(apiCalendarDir, 'route.ts')]: `import { NextResponse } from 'next/server';
import { PlanningAgentService } from '../../../../../../../organic-traffic-os/core/agents/planning-agent/planning-agent.service';
import { DiscoveryAgentService } from '../../../../../../../organic-traffic-os/core/agents/discovery-agent/discovery-agent.service';
export async function GET() {
  const dService = new DiscoveryAgentService();
  const discovery = await dService.runDiscovery({ blog_id: 'passacumaru', topic: 'Concurso Cumaru', mode: 'mock', limit: 10 });
  const pService = new PlanningAgentService();
  const backlog = pService.generateBacklog(discovery.opportunities);
  const calendar = pService.generateCalendar(backlog, new Date().toISOString().split('T')[0], 8);
  return NextResponse.json(calendar);
}
`,

// ─── UI PANEL ──────────────────────────────────────────────────────────────
[path.join(pageDir, 'page.tsx')]: `"use client";
import React, { useState } from 'react';

const s = {
  card: (extra?: React.CSSProperties): React.CSSProperties => ({
    backgroundColor: '#0e1119', border: '1px solid #1d2133',
    borderRadius: '16px', padding: '24px', ...extra
  }),
  badge: (color: string): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', padding: '2px 10px',
    borderRadius: '999px', fontSize: '11px', fontWeight: '700',
    backgroundColor: color + '18', color, border: \`1px solid \${color}30\`
  })
};

const priorityColor: Record<string, string> = {
  critical: '#f43f5e', high: '#f59e0b', medium: '#6366f1', low: '#64748b'
};

const tabs = ['Backlog', 'Calendário', 'Roadmap'];

export default function PlanningAgentPanel() {
  const [blogId, setBlogId] = useState('passacumaru');
  const [topic, setTopic] = useState('Concurso Prefeitura de Cumaru do Norte');
  const [weeks, setWeeks] = useState(8);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Backlog');

  async function run() {
    setLoading(true);
    try {
      const res = await fetch('/api/organic-os/agents/planning/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blog_id: blogId, topic, weeks })
      });
      setReport(await res.json());
    } finally { setLoading(false); }
  }

  const input: React.CSSProperties = {
    backgroundColor: '#080b10', border: '1px solid #1d2133',
    borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0',
    fontSize: '13px', width: '100%', outline: 'none', fontFamily: 'inherit'
  };

  return (
    <div style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px', color: '#f1f5f9' }}>
            📋 Planning Agent
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px', fontSize: '15px' }}>
            Transforma oportunidades em backlog priorizado, calendário e roadmap editorial.
          </p>
        </div>
        <div style={{ ...s.badge('#10b981') as any, fontSize: '12px', padding: '6px 14px' }}>
          v1.0.0 — ACTIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Form */}
        <div style={s.card()}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 18px' }}>
            Configurar Planning
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Blog ID', val: blogId, set: setBlogId },
              { label: 'Topic', val: topic, set: setTopic }
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                <input style={input} value={f.val} onChange={e => f.set(e.target.value)} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Semanas ({weeks})</label>
              <input style={input} type="range" min={2} max={24} value={weeks} onChange={e => setWeeks(+e.target.value)} />
            </div>
            <button onClick={run} disabled={loading} style={{
              marginTop: '6px', width: '100%', padding: '12px',
              background: loading ? '#1d2133' : 'linear-gradient(135deg, #6366f1, #818cf8)',
              border: 'none', borderRadius: '10px', color: '#fff',
              fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)'
            }}>
              {loading ? '⚡ Planejando...' : '🗺️ Gerar Plano Editorial'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {!report && !loading && (
            <div style={{ ...s.card(), textAlign: 'center', padding: '64px', color: '#3d4461' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Configure e execute o Planning Agent</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>Backlog, Calendário e Roadmap aparecerão aqui</div>
            </div>
          )}

          {report && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Backlog', value: report.summary.itens_backlog, color: '#6366f1' },
                  { label: 'Críticos', value: report.summary.criticos, color: '#f43f5e' },
                  { label: 'Clusters', value: report.summary.clusters_identificados, color: '#10b981' },
                  { label: 'Semanas', value: report.summary.semanas_estimadas, color: '#f59e0b' }
                ].map((s2, i) => (
                  <div key={i} style={{ ...s.card({ padding: '16px' }), textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', fontWeight: '900', color: s2.color }}>{s2.value}</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s2.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0e1119', border: '1px solid #1d2133', borderRadius: '12px', padding: '4px' }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{
                    flex: 1, padding: '8px 12px', border: 'none', borderRadius: '8px',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    backgroundColor: activeTab === tab ? '#6366f1' : 'transparent',
                    color: activeTab === tab ? '#fff' : '#64748b',
                    transition: 'all 0.15s'
                  }}>{tab}</button>
                ))}
              </div>

              {/* BACKLOG TAB */}
              {activeTab === 'Backlog' && (
                <div style={s.card()}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Itens do Backlog ({report.backlog.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {report.backlog.map((item: any, i: number) => (
                      <div key={i} style={{
                        backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px',
                        padding: '14px 16px', borderLeft: \`3px solid \${priorityColor[item.prioridade]}\`,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '5px' }}>{item.titulo}</div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                            <span style={s.badge(priorityColor[item.prioridade])}>{item.prioridade}</span>
                            <span style={s.badge('#64748b')}>{item.tipo}</span>
                            <span style={s.badge('#818cf8')}>{item.cluster}</span>
                            <span style={s.badge('#10b981')}>{item.estimativa_dias}d</span>
                          </div>
                          {item.dependencias.length > 0 && (
                            <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '6px' }}>
                              ⚠️ Depende de: {item.dependencias.join(', ')}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '50px' }}>
                          <div style={{ fontSize: '24px', fontWeight: '900', color: item.score >= 80 ? '#10b981' : item.score >= 60 ? '#f59e0b' : '#64748b' }}>
                            {item.score}
                          </div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: '700' }}>SCORE</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CALENDAR TAB */}
              {activeTab === 'Calendário' && (
                <div style={s.card()}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Calendário Editorial
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {report.calendar.map((entry: any, i: number) => (
                      <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '100px 1fr auto',
                        backgroundColor: '#080b10', border: '1px solid #1d2133',
                        borderRadius: '8px', padding: '12px 14px', gap: '12px', alignItems: 'center'
                      }}>
                        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6366f1', fontWeight: '700' }}>
                          {entry.data_prevista}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: '600' }}>{entry.titulo}</div>
                          {entry.observacoes && <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '3px' }}>⚠️ {entry.observacoes}</div>}
                        </div>
                        <span style={s.badge(priorityColor[entry.prioridade])}>{entry.prioridade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ROADMAP TAB */}
              {activeTab === 'Roadmap' && (
                <div style={s.card()}>
                  <h3 style={{ margin: '0 0 20px', fontSize: '14px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    Roadmap de Produção ({report.roadmap.semanas_totais} semanas)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {report.roadmap.fases.map((fase: any, i: number) => (
                      <div key={i} style={{ backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '12px', padding: '16px', borderTop: \`3px solid \${['#6366f1','#10b981','#f59e0b'][i] || '#64748b'}\` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fase {fase.fase}</span>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#e2e8f0' }}>{fase.nome}</div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                            Sem {fase.semana_inicio} → {fase.semana_fim}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{fase.itens.length} itens nesta fase</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: '#080b10', border: '1px solid #1d2133', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Clusters</div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                      {report.roadmap.clusters.map((c: string, i: number) => (
                        <span key={i} style={s.badge('#818cf8')}>{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {report.warnings?.length > 0 && (
                <div style={{ ...s.card({ borderLeft: '3px solid #f59e0b', padding: '14px 18px' }), display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {report.warnings.map((w: string, i: number) => (
                    <div key={i} style={{ fontSize: '12px', color: '#f59e0b', display: 'flex', gap: '8px' }}>
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

// ─── REPORT ────────────────────────────────────────────────────────────────
[path.join(reportsDir, 'sprint-26-3-summary.md')]: `# Sprint 26.3 — Planning Agent V1

## O Que Foi Criado
O segundo agente autônomo do Organic Traffic OS.

## Arquitetura
O Planning Agent consome o output do Discovery Agent e aplica:
1. **analyzeOpportunities()** — analisa e filtra duplicatas
2. **mergeDuplicates()** — remove redundâncias por cluster+tipo
3. **calculatePriority()** — calcula score composto (Impacto 30%, Urgência 25%, ROI 20%, Autoridade 15%, Facilidade 10%)
4. **groupByCluster()** — agrupa por cluster editorial
5. **generateBacklog()** — gera backlog com dependências automáticas
6. **generateCalendar()** — distribui em calendário com cadência de 3 itens/semana
7. **buildRoadmap()** — divide em 3 fases (Fundação, Expansão, Conversão)

## Regra de Dependências
- FAQ → requer artigo principal
- Artigo satélite → requer página pilar  
- Quiz → requer conteúdo base
- Landing Page → requer conteúdo principal
- Checklist → requer guia completo

## APIs Criadas
- \`POST /api/organic-os/agents/planning/run\`
- \`GET /api/organic-os/agents/planning/backlog\`
- \`GET /api/organic-os/agents/planning/calendar\`
- \`GET /api/organic-os/agents/planning/history\`

## Próximos Passos
Sprint 26.4 — Writer Agent (geração de rascunhos a partir do Backlog)
`
};

// Fix the typo in types file
const typesContent = files[path.join(agentDir, 'planning-agent.types.ts')].replace('PlanningSummary;', 'PlanningSummary;').replace('PlanningSummary ummary', 'PlanningSummary');
files[path.join(agentDir, 'planning-agent.types.ts')] = typesContent;

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('✓ ' + path.relative(__dirname, filepath));
}
