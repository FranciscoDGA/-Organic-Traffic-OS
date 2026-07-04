export interface ODcOpportunity {
  id: string;
  workspace_id: string;
  title: string;
  type: string;
  priority: string;
  score: number;
  description: string;
  created_at: string;
}

const opportunities: ODcOpportunity[] = [
  { id: 'opp-001', workspace_id: 'passacumaru', title: 'Expansao cluster viagens', type: 'cluster-expansion', priority: 'high', score: 85, description: 'Oportunidade de expandir cluster de viagens', created_at: '2026-07-01' },
  { id: 'opp-002', workspace_id: 'passacumaru', title: 'Artigo pillar sustentabilidade', type: 'content-creation', priority: 'medium', score: 72, description: 'Criar artigo pillar sobre turismo sustentavel', created_at: '2026-07-02' },
];

export class ODCIService {
  getOpportunities(workspaceId?: string): ODcOpportunity[] {
    if (workspaceId) return opportunities.filter(o => o.workspace_id === workspaceId);
    return opportunities;
  }
  createMissionFromOpportunity(oppId: string): { success: boolean; mission_id?: string; error?: string } {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return { success: false, error: 'Opportunity not found' };
    return { success: true, mission_id: `msn-${Date.now()}` };
  }
  generateReport(): Record<string, any> {
    return { total: opportunities.length, by_type: {}, by_priority: {}, avg_score: 78 };
  }
}

let instance: ODCIService | null = null;
export function getODCIService(): ODCIService {
  if (!instance) instance = new ODCIService();
  return instance;
}
