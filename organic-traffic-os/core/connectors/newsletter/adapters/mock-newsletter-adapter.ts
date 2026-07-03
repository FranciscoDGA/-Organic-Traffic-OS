import { NewsletterAdapter } from './newsletter-adapter.interface';

export class MockNewsletterAdapter implements NewsletterAdapter {
  private audiences = [
    { id: 'list-1', name: 'Assinantes Blog', count: 2450 },
    { id: 'list-2', name: 'Alunos Concursos', count: 890 },
    { id: 'list-3', name: 'Leilão Premium', count: 120 },
  ];
  private campaigns: any[] = [
    { id: 'camp-1', subject: 'Guia Definitivo Concursos 2026', preheader: 'Tudo que você precisa saber', status: 'sent', created_at: '2026-06-10', updated_at: '2026-06-10' },
    { id: 'camp-2', subject: '5 Dicas para Estudar Mais', preheader: 'Estratégias comprovadas', status: 'draft', created_at: '2026-06-20', updated_at: '2026-06-20' },
    { id: 'camp-3', subject: 'Novidades Legislação Julho', preheader: 'Leis que mudaram', status: 'draft', created_at: '2026-06-28', updated_at: '2026-06-28' },
  ];

  async testConnection(): Promise<{ success: boolean; name?: string; error?: string }> {
    return { success: true, name: 'Mock Newsletter' };
  }

  async listAudiences(): Promise<{ id: string; name: string; count: number }[]> {
    return this.audiences;
  }

  async listCampaigns(limit = 20): Promise<any[]> {
    return this.campaigns.slice(0, limit);
  }

  async createCampaign(data: Record<string, any>): Promise<any> {
    const newCamp = { id: `camp-${this.campaigns.length + 1}`, ...data, status: 'draft', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    this.campaigns.push(newCamp);
    return newCamp;
  }

  async updateCampaign(id: string, data: Record<string, any>): Promise<any> {
    const idx = this.campaigns.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Campaign not found');
    this.campaigns[idx] = { ...this.campaigns[idx], ...data, updated_at: new Date().toISOString() };
    return this.campaigns[idx];
  }

  async getCampaign(id: string): Promise<any> {
    return this.campaigns.find(c => c.id === id) || null;
  }
}
