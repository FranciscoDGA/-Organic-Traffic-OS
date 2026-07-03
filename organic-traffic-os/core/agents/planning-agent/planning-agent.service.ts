import {
  PlanningInput, BacklogItem, CalendarEntry, PlanningReport,
  Roadmap, RoadmapPhase, PlanningSummary, ContentPriority
} from './planning-agent.types';
import { PlanningAgentValidator } from './planning-agent.validator';
import { DiscoveryOpportunity } from '../discovery-agent/discovery-agent.types';

const CADENCIA = 3;

const ESTIMATIVA: Record<string, number> = {
  article: 2, guide: 3, faq: 1, checklist: 1,
  'landing-page': 4, ebook: 7, comparison: 2, timeline: 2, glossary: 2
};

const DEPENDENCY_RULES: Record<string, string> = {
  faq: 'article',
  'article-satelite': 'pillar-page',
  quiz: 'article',
  'landing-page': 'article',
  checklist: 'guide',
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
    const unique = this.analyzeOpportunities(opps);
    return { unique, removed: opps.length - unique.length };
  }

  calculatePriority(opp: DiscoveryOpportunity) {
    return {
      impacto: Math.min(100, Math.round(opp.score * 1.1)),
      urgencia: opp.priority === 'critical' ? 95 : opp.priority === 'high' ? 75 : opp.priority === 'medium' ? 50 : 25,
      roi: Math.round(opp.score * 0.9),
      facilidade: (ESTIMATIVA[opp.type] || 2) <= 2 ? 80 : (ESTIMATIVA[opp.type] || 2) <= 3 ? 60 : 40,
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
      const depType = DEPENDENCY_RULES[opp.type];
      const clusterSlug = opp.cluster.toLowerCase().replace(/\s/g, '-');
      const deps = depType ? [depType + '-' + clusterSlug] : [];
      return {
        id: 'backlog-' + (i + 1) + '-' + Date.now(),
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
        score_facilidade: scores.facilidade,
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
        id: 'cal-' + (slotIndex + 1),
        data_prevista: date.toISOString().split('T')[0],
        titulo: item.titulo,
        tipo: item.tipo,
        cluster: item.cluster,
        prioridade: item.prioridade,
        status: 'pending',
        observacoes: item.dependencias.length > 0 ? 'Depende de: ' + item.dependencias.join(', ') : '',
      });
      slotIndex++;
    }
    return calendar;
  }

  buildRoadmap(backlog: BacklogItem[], weeks: number, blogId: string): Roadmap {
    const clusters = [...new Set(backlog.map(b => b.cluster))];
    const size = Math.ceil(backlog.length / 3);
    const fases: RoadmapPhase[] = [
      {
        fase: 1, nome: 'Fundação (Pilares)',
        semana_inicio: 1, semana_fim: Math.ceil(weeks / 3),
        itens: backlog.slice(0, size).filter(b => ['guide', 'article'].includes(b.tipo))
      },
      {
        fase: 2, nome: 'Expansão (Clusters)',
        semana_inicio: Math.ceil(weeks / 3) + 1, semana_fim: Math.ceil(weeks * 2 / 3),
        itens: backlog.slice(size, size * 2)
      },
      {
        fase: 3, nome: 'Conversão (Leads)',
        semana_inicio: Math.ceil(weeks * 2 / 3) + 1, semana_fim: weeks,
        itens: backlog.slice(size * 2).filter(b => ['ebook', 'checklist', 'landing-page'].includes(b.tipo))
      },
    ];
    return { blog_id: blogId, semanas_totais: weeks, total_itens: backlog.length, clusters, fases };
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
      medios: backlog.filter(b => b.prioridade === 'medium').length,
    };
  }

  async runPlanning(input: PlanningInput): Promise<PlanningReport> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));
    const opps = input.discovery_report.opportunities;
    const { removed } = this.mergeDuplicates(opps);
    const backlog = this.generateBacklog(opps);
    const calendar = this.generateCalendar(backlog, input.start_date, input.weeks);
    const roadmap = this.buildRoadmap(backlog, input.weeks, input.blog_id);
    const summary = { ...this.calculateScores(backlog), duplicatas_removidas: removed };
    return {
      agent: 'planning-agent',
      blog_id: input.blog_id,
      backlog, calendar, roadmap, summary,
      warnings: [
        '[MOCK] Calendário baseado em dados simulados. Conectar GSC para dados reais.',
        '[MOCK] Dependências calculadas por tipo — revisar manualmente para casos especiais.',
      ],
      created_at: new Date().toISOString(),
    };
  }
}
