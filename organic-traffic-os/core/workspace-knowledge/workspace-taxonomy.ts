import { Taxonomy } from './workspace-knowledge.types';

export const workspaceTaxonomies: Record<string, Taxonomy> = {
  passacumaru: {
    workspaceId: 'passacumaru',
    categories: [
      { id: 'concursos', name: 'Concursos', slug: 'concursos', description: 'Todo tipo de concurso publico', subcategories: [
        { id: 'federais', name: 'Federais', slug: 'federais', description: 'Concursos do governo federal' },
        { id: 'estaduais', name: 'Estaduais', slug: 'estaduais', description: 'Concursos estaduais' },
        { id: 'municipais', name: 'Municipais', slug: 'municipais', description: 'Concursos municipais' },
      ]},
      { id: 'editais', name: 'Editais', slug: 'editais', description: 'Editais e publicacoes oficiais', subcategories: [
        { id: 'editais-abertos', name: 'Editais Abertos', slug: 'editais-abertos', description: 'Editais com inscricoes abertas' },
        { id: 'editais-proximos', name: 'Editais Proximos', slug: 'editais-proximos', description: 'Editais que serao publicados' },
      ]},
      { id: 'dicas', name: 'Dicas', slug: 'dicas', description: 'Dicas para concurseiros', subcategories: [
        { id: 'estudo', name: 'Estudo', slug: 'estudo', description: 'Metodos de estudo' },
        { id: 'saude', name: 'Saude', slug: 'saude', description: 'Saude do concurseiro' },
      ]},
    ],
    tags: ['concurso', 'edital', 'banca', 'prova', 'aprovacao', 'estudo', 'concursos-publicos'],
    contentTypes: ['artigo', 'noticia', 'guia', 'lista', 'comparativo', 'review'],
    clusters: ['concursos-municipais', 'editais-saude', 'concursos-federal'],
    pillarPages: ['guia-completo-concursos', 'como-passar-em-concursos'],
    relationships: [
      { source: 'concursos', target: 'editais', type: 'relacionado' },
      { source: 'dicas', target: 'concursos', type: 'suporte' },
    ],
  },
  garimpeibrasil: {
    workspaceId: 'garimpeibrasil',
    categories: [
      { id: 'investimentos', name: 'Investimentos', slug: 'investimentos', description: 'Opcoes de investimento', subcategories: [
        { id: 'renda-fixa', name: 'Renda Fixa', slug: 'renda-fixa', description: 'Investimentos de renda fixa' },
        { id: 'renda-variavel', name: 'Renda Variavel', slug: 'renda-variavel', description: 'Investimentos de renda variavel' },
      ]},
      { id: 'educacao-financeira', name: 'Educacao Financeira', slug: 'educacao-financeira', description: 'Conteudos educativos', subcategories: [
        { id: 'orcamento', name: 'Orcamento', slug: 'orcamento', description: 'Controle financeiro' },
        { id: 'poupanca', name: 'Poupanca', slug: 'poupanca', description: 'Estrategias de poupanca' },
      ]},
    ],
    tags: ['investimento', 'renda-fixa', 'cdb', 'tesouro-direto', 'selic', 'poupanca'],
    contentTypes: ['artigo', 'guia', 'comparativo', 'review'],
    clusters: ['renda-fixa', 'investimentos-iniciantes'],
    pillarPages: ['guia-investimentos', 'investimento-iniciante'],
    relationships: [
      { source: 'investimentos', target: 'educacao-financeira', type: 'relacionado' },
    ],
  },
};

export function getWorkspaceTaxonomy(workspaceId: string): Taxonomy | undefined {
  return workspaceTaxonomies[workspaceId];
}
