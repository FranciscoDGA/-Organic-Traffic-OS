export interface OpportunityModel {
  id: string;
  titulo: string;
  categoria: string;
  cluster: string;
  entidade: string;
  tipo: string;
  intencao: string;
  prioridade: 'Muito Alta' | 'Alta' | 'Média' | 'Baixa';
  score: number;
  origem: string[]; // ex: ['keyword-engine', 'competitor-gap']
  motivo: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada' | 'Gerada';
  criado_em: string;
}
