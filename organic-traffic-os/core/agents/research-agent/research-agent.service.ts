import {
  ResearchInput, ResearchPack, ResearchReport, ResearchSummary,
  ResearchEntity, ResearchQuestion, ResearchReference
} from './research-agent.types';
import { ResearchAgentValidator } from './research-agent.validator';
import { BacklogItem } from '../planning-agent/planning-agent.types';

// ── Mock Knowledge Base ──────────────────────────────────────────────────────
const MOCK_FACTS: Record<string, string[]> = {
  'Concurso Cumaru': [
    'A Prefeitura de Cumaru do Norte é localizada no Pará.',
    'A banca organizadora histórica é a IVIN.',
    'Os concursos municipais seguem a Lei Orgânica Municipal.',
    'O período de inscrições costuma durar 30 dias.',
    'Provas costumam ser aplicadas em Redenção ou Conceição do Araguaia.',
  ],
  'Banca IVIN': [
    'A IVIN é uma banca regional especializada em concursos municipais do Pará.',
    'Cobra intensamente Língua Portuguesa e Legislação Municipal.',
    'Questões costumam ter 4 alternativas (A, B, C, D).',
    'Média de aprovação nas provas: 60% dos pontos.',
  ],
  'Direito Municipal': [
    'Lei Orgânica Municipal rege a organização dos municípios.',
    'Estatuto dos Servidores define direitos e deveres do funcionalismo.',
    'IPTU, ISS e ITBI são tributos municipais mais cobrados em concursos.',
  ],
};

const MOCK_ENTITIES: Record<string, Omit<ResearchEntity, 'obrigatoria'>[]> = {
  'Concurso Cumaru': [
    { nome: 'Prefeitura de Cumaru do Norte', tipo: 'organizacao', importancia: 'critical', relacionamentos: ['IVIN', 'Edital'] },
    { nome: 'IVIN', tipo: 'organizacao', importancia: 'critical', relacionamentos: ['Provas', 'Banca'] },
    { nome: 'Lei Orgânica Municipal', tipo: 'lei', importancia: 'high', relacionamentos: ['Legislação', 'Concurso'] },
  ],
  'Banca IVIN': [
    { nome: 'IVIN', tipo: 'organizacao', importancia: 'critical', relacionamentos: ['Concurso', 'Provas'] },
    { nome: 'Língua Portuguesa', tipo: 'conceito', importancia: 'high', relacionamentos: ['Prova', 'Gabarito'] },
  ],
};

const MOCK_QUESTIONS: Record<string, Omit<ResearchQuestion, 'respondida' | 'resposta'>[]> = {
  'Concurso Cumaru': [
    { pergunta: 'Qual é o número de vagas do concurso?', prioridade: 'critical', origem: 'inventory-gap' },
    { pergunta: 'Qual é a data prevista para inscrições?', prioridade: 'critical', origem: 'serp-gap' },
    { pergunta: 'Quais são os cargos disponíveis?', prioridade: 'high', origem: 'keyword-research' },
    { pergunta: 'Qual é o salário inicial de cada cargo?', prioridade: 'high', origem: 'keyword-research' },
    { pergunta: 'Qual a taxa de inscrição?', prioridade: 'medium', origem: 'faq-analysis' },
  ],
  'Banca IVIN': [
    { pergunta: 'Quais são as disciplinas cobradas pela IVIN?', prioridade: 'critical', origem: 'knowledge-core' },
    { pergunta: 'Qual é o estilo de questões da IVIN?', prioridade: 'high', origem: 'competitor-gap' },
    { pergunta: 'A IVIN já realizou outros concursos no Pará?', prioridade: 'medium', origem: 'inventory-gap' },
  ],
};

const MOCK_REFERENCES: ResearchReference[] = [
  {
    titulo: 'Lei Orgânica do Município de Cumaru do Norte',
    tipo: 'lei', fonte: 'Câmara Municipal de Cumaru do Norte',
    url: 'https://camaracumarudonorte.pa.gov.br',
    confianca: 'high', status: 'validado',
  },
  {
    titulo: 'Portal da Prefeitura de Cumaru do Norte',
    tipo: 'site-oficial', fonte: 'Prefeitura Municipal',
    url: 'https://cumarudonorte.pa.gov.br',
    confianca: 'high', status: 'validado',
  },
  {
    titulo: 'Edital do Último Concurso IVIN',
    tipo: 'edital', fonte: 'IVIN — Instituto de Valorização Individual',
    confianca: 'medium', status: 'pendente',
  },
];

export class ResearchAgentService {
  private validator = new ResearchAgentValidator();

  collectKnowledge(item: BacklogItem): string[] {
    const cluster = item.cluster;
    return MOCK_FACTS[cluster] || [
      'Contexto geral do tema identificado.',
      'Dados específicos pendentes de validação via fontes primárias.',
    ];
  }

  collectFacts(item: BacklogItem): { conhecidos: string[]; pendentes: string[] } {
    const conhecidos = this.collectKnowledge(item);
    const pendentes = [
      'Número exato de vagas — pendente publicação do edital.',
      'Data oficial de inscrições — aguardando confirmação.',
      'Gabarito preliminar — disponível somente após a prova.',
    ];
    return { conhecidos, pendentes };
  }

  collectEntities(item: BacklogItem): ResearchEntity[] {
    const base = MOCK_ENTITIES[item.cluster] || [];
    return base.map(e => ({ ...e, obrigatoria: e.importancia === 'critical' }));
  }

  collectQuestions(item: BacklogItem): ResearchQuestion[] {
    const base = MOCK_QUESTIONS[item.cluster] || [
      { pergunta: 'Qual é o contexto principal do tema?', prioridade: 'high' as const, origem: 'knowledge-core' },
      { pergunta: 'Quem é o público-alvo deste conteúdo?', prioridade: 'medium' as const, origem: 'persona-analysis' },
    ];
    return base.map(q => ({
      ...q,
      respondida: q.prioridade === 'low',
      resposta: q.prioridade === 'low' ? 'Respondida via knowledge base.' : undefined,
    }));
  }

  collectSources(_item: BacklogItem): ResearchReference[] {
    return MOCK_REFERENCES;
  }

  validateSources(refs: ResearchReference[]): ResearchReference[] {
    return refs; // In future: HTTP check or GSC validation
  }

  buildEntityMap(item: BacklogItem): ResearchEntity[] {
    return this.collectEntities(item);
  }

  buildQuestionMap(item: BacklogItem): ResearchQuestion[] {
    return this.collectQuestions(item);
  }

  generateSummary(pack: ResearchPack): ResearchSummary {
    const respondidas = pack.perguntas_obrigatorias.filter(q => q.respondida).length;
    const validadas = pack.fontes_consultadas.filter(r => r.status === 'validado').length;
    const obrigatorias = pack.entidades_obrigatorias.filter(e => e.obrigatoria).length;
    const cobertura = Math.round(
      ((pack.fatos_conhecidos.length / (pack.fatos_conhecidos.length + pack.fatos_pendentes.length || 1)) * 100)
    );
    return {
      total_fatos: pack.fatos_conhecidos.length + pack.fatos_pendentes.length,
      fatos_validados: pack.fatos_conhecidos.length,
      fatos_pendentes: pack.fatos_pendentes.length,
      total_entidades: pack.entidades_obrigatorias.length,
      entidades_obrigatorias: obrigatorias,
      total_perguntas: pack.perguntas_obrigatorias.length,
      perguntas_respondidas: respondidas,
      total_referencias: pack.fontes_consultadas.length,
      referencias_validadas: validadas,
      cobertura_pct: cobertura,
    };
  }

  buildResearchPack(input: ResearchInput): ResearchPack {
    const item = input.backlog_item;
    const facts = this.collectFacts(item);
    const entities = this.collectEntities(item);
    const questions = this.collectQuestions(item);
    const sources = this.validateSources(this.collectSources(item));

    return {
      id: 'rp-' + Date.now(),
      content_id: item.id,
      titulo: item.titulo,
      objetivo: 'Fornecer base de conhecimento estruturada para produção do conteúdo.',
      cluster: item.cluster,
      categoria: item.categoria,
      persona: 'Candidato a concurso público municipal — nível iniciante a intermediário',
      resumo_executivo:
        'Research Pack gerado pelo Research Agent com base nos dados disponíveis no Knowledge Core, Inventory e Connectors Mock. ' +
        'Todos os fatos marcados como pendentes devem ser validados antes da redação final.',
      contexto: 'Conteúdo planejado para o blog PassaCumaru, focado no nicho de concursos públicos municipais do Pará.',
      principais_topicos: [
        item.titulo,
        'Contexto do cluster: ' + item.cluster,
        'Banca organizadora e estilo de provas',
        'Legislação aplicável',
        'Dicas para candidatos iniciantes',
      ],
      perguntas_obrigatorias: questions,
      entidades_obrigatorias: entities,
      fontes_consultadas: sources,
      fatos_conhecidos: facts.conhecidos,
      fatos_pendentes: facts.pendentes,
      links_internos_sugeridos: [
        '/lei-organica-municipal-resumo',
        '/banca-ivin-guia-completo',
        '/como-estudar-para-concurso-municipal',
      ],
      links_externos_sugeridos: [
        'https://cumarudonorte.pa.gov.br',
        'https://camaracumarudonorte.pa.gov.br',
      ],
      observacoes: '[MOCK] Dados gerados em modo simulado. Ativar conectores GSC/GA4 para enriquecer automaticamente.',
      status: facts.pendentes.length > 2 ? 'partial' : 'complete',
      versao: '1.0',
      created_at: new Date().toISOString(),
    };
  }

  validateResearch(pack: ResearchPack): string[] {
    const warnings: string[] = [];
    if (pack.fatos_pendentes.length > 0) warnings.push('[MOCK] ' + pack.fatos_pendentes.length + ' fato(s) aguardando validação.');
    if (pack.perguntas_obrigatorias.filter(q => !q.respondida).length > 0)
      warnings.push('Existem perguntas obrigatórias sem resposta — revisar antes da redação.');
    if (pack.fontes_consultadas.filter(r => r.status === 'pendente').length > 0)
      warnings.push('Há fontes pendentes de validação na Reference List.');
    return warnings;
  }

  async runResearch(input: ResearchInput): Promise<ResearchReport> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const pack = this.buildResearchPack(input);
    const summary = this.generateSummary(pack);
    const warnings = this.validateResearch(pack);

    return {
      agent: 'research-agent',
      blog_id: input.blog_id,
      pack,
      summary,
      warnings,
      created_at: new Date().toISOString(),
    };
  }
}
