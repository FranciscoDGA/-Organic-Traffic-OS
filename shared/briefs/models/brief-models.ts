export interface BriefTemplate {
  id: string;
  titulo: string;
  objetivo: string;
  categoria: string;
  cluster: string;
  tipo: string;
  status: 'Pendente' | 'Draft' | 'Revisão' | 'Aprovado';
  versao: number;
  autor: string;
  criado_em: string;
}

export interface SearchIntent {
  intencao_principal: string;
  intencoes_secundarias: string[];
  problemas: string[];
  objetivos: string[];
}

export interface Entities {
  obrigatorias: string[];
  secundarias: string[];
}

export interface Questions {
  obrigatorias: string[];
  complementares: string[];
  relacionadas: string[];
}

export interface Outline {
  h1: string;
  introducao: string;
  h2: string[];
  h3: string[];
  h4: string[];
  resumo: string;
  faq: boolean;
  cta: string;
}

export interface SeoBrief {
  meta_title: string;
  meta_description: string;
  slug: string;
  keyword_principal: string;
  keywords_secundarias: string[];
  schema_recomendado: string;
}

export interface InternalLinks {
  paginas_recomendadas: string[];
  artigos_relacionados: string[];
  categorias: string[];
  produtos: string[];
}

export interface References {
  fontes: string[];
  documentacao: string[];
  links_oficiais: string[];
  observacoes: string;
}

export interface WritingGuidelines {
  tom: string;
  publico: string;
  objetivo: string;
  nivel_tecnico: string;
  tamanho_esperado: string;
  formato: string;
}

export interface BriefScoreResult {
  score: number;
  detalhes: any;
}
