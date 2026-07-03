export interface NewsletterAdapter {
  testConnection(): Promise<{ success: boolean; name?: string; error?: string }>;
  listAudiences(): Promise<{ id: string; name: string; count: number }[]>;
  listCampaigns(limit?: number): Promise<any[]>;
  createCampaign(data: Record<string, any>): Promise<any>;
  updateCampaign(id: string, data: Record<string, any>): Promise<any>;
  getCampaign(id: string): Promise<any>;
}
