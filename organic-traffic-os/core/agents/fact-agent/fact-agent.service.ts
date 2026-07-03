import {
  FactInput, EvidencePack, FactReport, ConfidenceReport, Fact, FactConflict, ConfidenceGrade
} from './fact-agent.types';
import { FactAgentValidator } from './fact-agent.validator';
import { ResearchPack, ResearchReference } from '../research-agent/research-agent.types';

export class FactAgentService {
  private validator = new FactAgentValidator();

  extractFacts(pack: ResearchPack): Partial<Fact>[] {
    const conhecidos = pack.fatos_conhecidos.map(f => ({ descricao: f, status: 'approved' as const, origem: 'knowledge_core' }));
    const pendentes = pack.fatos_pendentes.map(f => ({ descricao: f, status: 'pending' as const, origem: 'research_pack' }));
    return [...conhecidos, ...pendentes];
  }

  validateFacts(facts: Partial<Fact>[], sources: ResearchReference[]): Fact[] {
    return facts.map((f, i) => {
      const isApproved = f.status === 'approved';
      const confianca = isApproved ? 95 : 40;
      return {
        id: `fact-${i}-${Date.now()}`,
        descricao: f.descricao || '',
        categoria: 'geral',
        origem: f.origem || 'unknown',
        fonte_id: sources[0]?.url || 'internal',
        evidencias: sources.map(s => s.titulo),
        nivel_de_confianca: confianca,
        status: isApproved ? 'approved' : 'pending',
        ultima_verificacao: new Date().toISOString(),
        versao: '1.0',
        observacoes: isApproved ? 'Fato previamente validado pelo Knowledge Core.' : 'Aguardando validação de fonte primária.',
      };
    });
  }

  detectConflicts(facts: Fact[], sources: ResearchReference[]): FactConflict[] {
    // Mock conflict detection
    const conflicts: FactConflict[] = [];
    if (facts.some(f => f.descricao.toLowerCase().includes('vagas') && f.status === 'pending')) {
      conflicts.push({
        id: `conflict-${Date.now()}`,
        fato: 'Número de vagas',
        fontes_conflitantes: ['Especulação em fóruns', 'Edital anterior'],
        descricao_do_conflito: 'Diferentes fontes apontam números diferentes de vagas estimadas.',
        impacto: 'high',
        status: 'open',
        acao_recomendada: 'Aguardar publicação do edital oficial.',
        necessita_revisao_humana: true,
      });
    }
    return conflicts;
  }

  calculateConfidence(facts: Fact[], conflicts: FactConflict[], sources: ResearchReference[]): ConfidenceReport {
    const total = facts.length || 1;
    const aprovados = facts.filter(f => f.status === 'approved').length;
    const pendentes = facts.filter(f => f.status === 'pending').length;
    const rejeitados = facts.filter(f => f.status === 'rejected').length;
    
    const avgConf = Math.round(facts.reduce((acc, f) => acc + f.nivel_de_confianca, 0) / total);
    let grade: ConfidenceGrade = 'F';
    if (avgConf >= 90) grade = 'A';
    else if (avgConf >= 75) grade = 'B';
    else if (avgConf >= 60) grade = 'C';
    else if (avgConf >= 40) grade = 'D';

    return {
      total_fatos: facts.length,
      aprovados,
      pendentes,
      rejeitados,
      confianca_media: avgConf,
      grade,
      total_conflitos: conflicts.length,
      conflitos_abertos: conflicts.filter(c => c.status === 'open').length,
      fontes_unicas: sources.length,
      rastreabilidade_pct: Math.round((aprovados / total) * 100),
    };
  }

  buildEvidencePack(pack: ResearchPack, facts: Fact[], conflicts: FactConflict[], sources: ResearchReference[]): EvidencePack {
    const aprovados = facts.filter(f => f.status === 'approved');
    const pendentes = facts.filter(f => f.status === 'pending');
    const rejeitados = facts.filter(f => f.status === 'rejected');
    
    const avgConf = Math.round(facts.reduce((acc, f) => acc + f.nivel_de_confianca, 0) / (facts.length || 1));

    return {
      id: `ep-${Date.now()}`,
      content_id: pack.content_id,
      research_pack_id: pack.id,
      versao: '1.0',
      data: new Date().toISOString(),
      status: pendentes.length === 0 && conflicts.length === 0 ? 'approved' : 'partial',
      autoridade_media: 85, // Mock
      confiabilidade_media: avgConf,
      fatos_aprovados: aprovados,
      fatos_pendentes: pendentes,
      fatos_rejeitados: rejeitados,
      fontes_relacionadas: sources,
      conflitos: conflicts,
      observacoes: 'Base de evidências gerada automaticamente pelo Fact Agent.',
    };
  }

  async runFactValidation(input: FactInput): Promise<FactReport> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const pack = input.research_pack;
    const sources = pack.fontes_consultadas || [];
    
    const rawFacts = this.extractFacts(pack);
    const facts = this.validateFacts(rawFacts, sources);
    const conflicts = this.detectConflicts(facts, sources);
    const confidence = this.calculateConfidence(facts, conflicts, sources);
    const evidencePack = this.buildEvidencePack(pack, facts, conflicts, sources);

    const isApproved = evidencePack.status === 'approved';

    return {
      agent: 'fact-agent',
      blog_id: input.blog_id,
      evidence_pack: evidencePack,
      confidence,
      warnings: conflicts.map(c => `[CONFLITO] ${c.descricao_do_conflito}`),
      approved: isApproved,
      created_at: new Date().toISOString(),
    };
  }
}
