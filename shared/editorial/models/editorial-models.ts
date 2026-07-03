export interface EditorialItem {
  id: string;
  titulo: string;
  cluster: string;
  categoria: string;
  tipo: string;
  prioridade: string;
  score: number;
  dependencias: string[];
  status: 'Backlog' | 'Agendado' | 'Em Produção' | 'Publicado';
  estimativa: string;
  objetivo: string;
  cta: string;
}

export interface CalendarItem {
  id: string;
  data: string;
  conteudo: string; // id do EditorialItem
  categoria: string;
  cluster: string;
  status: 'Agendado' | 'Publicado' | 'Atrasado';
  responsavel: string;
}

export interface RoadmapData {
  curto_prazo: EditorialItem[];
  medio_prazo: EditorialItem[];
  longo_prazo: EditorialItem[];
}

export interface DependencyData {
  pai: string;
  filhos: string[];
  tipo: 'Pilar' | 'Satélite' | 'FAQ';
}

export interface BacklogData {
  pendentes: EditorialItem[];
  em_planejamento: EditorialItem[];
  prontos: EditorialItem[];
  bloqueados: EditorialItem[];
  arquivados: EditorialItem[];
}
