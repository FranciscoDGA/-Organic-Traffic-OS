import { Experiment, ExperimentAnalysis } from './experimentation.types';
import { createExperiment, createVariant } from './experiment-manager';
import { analyzeExperiment, simulateMetrics } from './experiment-runner';
import { validateExperiment } from './experiment-validator';

const experiments: Map<string, Experiment[]> = new Map();
const analyses: ExperimentAnalysis[] = [];

function init() {
  const ws = 'passacumaru';
  const e1 = createExperiment({ workspaceId: ws, name: 'Teste Titulo INSS', hypothesis: 'Titulos com "Guia Completo" tem CTR maior', type: 'title_test', primaryMetric: 'ctr', secondaryMetrics: ['clicks', 'impressions'] });
  e1.variants = [createVariant(e1.id, 'Variante A', 'Titulo original', 'Como se inscrever no INSS'), createVariant(e1.id, 'Variante B', 'Titulo com Guia', 'Guia Completo: Como se inscrever no INSS 2026')];
  e1.variants = e1.variants.map(v => simulateMetrics(v));
  e1.status = 'completed';
  const a1 = analyzeExperiment(e1);
  e1.winner = a1.winner;
  e1.confidence = a1.confidence;
  e1.conclusion = a1.conclusion;
  e1.startDate = new Date(Date.now() - 7 * 86400000).toISOString();
  e1.endDate = new Date().toISOString();

  const e2 = createExperiment({ workspaceId: ws, name: 'Teste CTA Editais', hypothesis: 'CTA "Ver Edital" converte mais que "Saiba Mais"', type: 'cta_test', primaryMetric: 'conversions', secondaryMetrics: ['clicks'] });
  e2.variants = [createVariant(e2.id, 'CTA Original', 'Saiba Mais', 'Link: Saiba Mais sobre este edital'), createVariant(e2.id, 'CTA Novo', 'Ver Edital', 'Link: Ver Edital Completo')];
  e2.variants = e2.variants.map(v => simulateMetrics(v));
  e2.status = 'running';
  e2.startDate = new Date(Date.now() - 3 * 86400000).toISOString();

  const e3 = createExperiment({ workspaceId: 'garimpeibrasil', name: 'Teste Formato Investimentos', hypothesis: 'Artigos em formato lista performam melhor', type: 'content_format_test', primaryMetric: 'engagement', secondaryMetrics: ['avg_time'] });
  e3.variants = [createVariant(e3.id, 'Formato Narrativo', 'Artigo tradicional', 'Texto narrativo sobre investimentos'), createVariant(e3.id, 'Formato Lista', 'Lista numerada', 'Top 10 investimentos para iniciantes')];
  e3.variants = e3.variants.map(v => simulateMetrics(v));
  e3.status = 'completed';
  const a3 = analyzeExperiment(e3);
  e3.winner = a3.winner;
  e3.confidence = a3.confidence;
  e3.conclusion = a3.conclusion;

  experiments.set(ws, [e1, e2]);
  experiments.set('garimpeibrasil', [e3]);
}
init();

export function getExperimentService() {
  return {
    getAll(workspaceId: string): Experiment[] {
      return experiments.get(workspaceId) || [];
    },

    getById(id: string): Experiment | undefined {
      for (const list of experiments.values()) {
        const found = list.find(e => e.id === id);
        if (found) return found;
      }
      return undefined;
    },

    create(params: { workspaceId: string; name: string; hypothesis: string; type: Experiment['type']; primaryMetric: Experiment['primaryMetric']; secondaryMetrics?: Experiment['primaryMetric'][] }) {
      const exp = createExperiment(params);
      const validation = validateExperiment(exp);
      if (!validation.valid) return { error: validation.errors };
      const list = experiments.get(params.workspaceId) || [];
      list.push(exp);
      experiments.set(params.workspaceId, list);
      return { experiment: exp };
    },

    addVariant(experimentId: string, name: string, description: string, changes: string) {
      const exp = this.getById(experimentId);
      if (!exp) return { error: 'Experiment not found' };
      const variant = createVariant(experimentId, name, description, changes);
      exp.variants.push(variant);
      exp.updatedAt = new Date().toISOString();
      return { variant };
    },

    start(id: string) {
      const exp = this.getById(id);
      if (!exp) return { error: 'Experiment not found' };
      exp.status = 'running';
      exp.startDate = new Date().toISOString();
      exp.updatedAt = new Date().toISOString();
      return { experiment: exp };
    },

    pause(id: string) {
      const exp = this.getById(id);
      if (!exp) return { error: 'Experiment not found' };
      exp.status = 'paused';
      exp.updatedAt = new Date().toISOString();
      return { experiment: exp };
    },

    stop(id: string) {
      const exp = this.getById(id);
      if (!exp) return { error: 'Experiment not found' };
      exp.status = 'completed';
      exp.endDate = new Date().toISOString();
      exp.updatedAt = new Date().toISOString();
      const analysis = analyzeExperiment(exp);
      exp.winner = analysis.winner;
      exp.confidence = analysis.confidence;
      exp.conclusion = analysis.conclusion;
      analyses.push(analysis);
      return { experiment: exp, analysis };
    },

    analyze(id: string) {
      const exp = this.getById(id);
      if (!exp) return { error: 'Experiment not found' };
      exp.variants = exp.variants.map(v => simulateMetrics(v));
      const analysis = analyzeExperiment(exp);
      analyses.push(analysis);
      return { analysis };
    },

    getAnalyses(workspaceId: string): ExperimentAnalysis[] {
      const ids = new Set((experiments.get(workspaceId) || []).map(e => e.id));
      return analyses.filter(a => ids.has(a.experimentId));
    },
  };
}
