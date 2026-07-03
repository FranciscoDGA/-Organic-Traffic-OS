import fs from 'fs';
import path from 'path';
import { OpportunityModel } from '../models/opportunity-model';
import { OpportunityRankingEngine } from '../ranking/opportunity-ranking';
import { OpportunityRules } from '../rules/opportunity-rules';
import { KeywordLoader } from '../../keywords/keyword-loader';
import { CompetitorLoader } from '../../competitors/competitor-loader';
import { InventoryLoader } from '../../inventory/inventory-loader';

export class OpportunityEngine {
  static async runWorkflow(blogId: string): Promise<OpportunityModel[]> {
    const logs = { time: new Date().toISOString(), sources: [] as string[], errors: [] as string[] };
    const candidates: OpportunityModel[] = [];

    // 1. Coleta Graciosa de Dados
    let keywordsData: any = { keywords: [] };
    let competitorsData: any = { opportunity_map: [] };
    let inventoryData: any = [];

    try {
      keywordsData = KeywordLoader.load(blogId);
      logs.sources.push('Keyword Engine');
    } catch (e: any) { logs.errors.push(`Keywords falharam: ${e.message}`); }

    try {
      competitorsData = CompetitorLoader.load(blogId);
      logs.sources.push('Competitors Engine');
    } catch (e: any) { logs.errors.push(`Competitors falharam: ${e.message}`); }

    try {
      inventoryData = InventoryLoader.load(blogId);
      logs.sources.push('Inventory Engine');
    } catch (e: any) { logs.errors.push(`Inventory falharam: ${e.message}`); }

    const context = { inventory: inventoryData };

    // 2. Extração de Candidadots das Keywords
    for (const kw of keywordsData.keywords || []) {
      const intentObj = keywordsData.intents?.find((i:any) => i.keyword_id === kw.id);
      
      const candidate: OpportunityModel = {
        id: `opp-kw-${kw.id}`,
        titulo: kw.keyword, // Em um cenário real, uma IA faria um titulo atrativo
        categoria: kw.categoria,
        cluster: kw.cluster,
        entidade: kw.entidade,
        tipo: 'Artigo SEO',
        intencao: intentObj?.intent || 'Informacional',
        prioridade: 'Baixa',
        score: 0,
        origem: ['keyword-engine'],
        motivo: 'Volume de busca detectado nas Keywords',
        status: 'Gerada',
        criado_em: new Date().toISOString()
      };
      candidates.push(candidate);
    }

    // 3. Extração de Candidatos dos Competitors (Gaps)
    for (const gap of competitorsData.opportunity_map || []) {
      if (!gap.passacumaru_cobre) {
        const candidate: OpportunityModel = {
          id: `opp-comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          titulo: gap.tema,
          categoria: 'Oportunidade de Mercado',
          cluster: 'cluster-geral',
          entidade: 'ent-geral',
          tipo: 'Guia Completo',
          intencao: 'Informacional',
          prioridade: 'Baixa',
          score: 0,
          origem: ['competitor-gap'],
          motivo: gap.observacoes,
          status: 'Gerada',
          criado_em: new Date().toISOString()
        };
        candidates.push(candidate);
      }
    }

    // 4. Filtragem por Regras
    const validCandidates = candidates.filter(c => OpportunityRules.filter(c, inventoryData));

    // 5. Ranking Engine
    const finalOpportunities = validCandidates.map(c => {
      const score = OpportunityRankingEngine.calculateScore(c, context);
      return {
        ...c,
        score,
        prioridade: OpportunityRankingEngine.assignPriority(score)
      };
    });

    // 6. Ordenação Final
    finalOpportunities.sort((a, b) => b.score - a.score);

    // 7. Salvar Dados
    this.saveData(blogId, finalOpportunities);

    return finalOpportunities;
  }

  private static saveData(blogId: string, opps: OpportunityModel[]) {
    const dir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'opportunities');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, 'opportunities.json'), JSON.stringify(opps, null, 2));
  }
}
