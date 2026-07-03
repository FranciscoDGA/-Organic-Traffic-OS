import fs from 'fs';
import path from 'path';
import { OpportunityModel } from '../models/opportunity-model';
import { OpportunityEngine } from './opportunity-engine';

export class OpportunityService {
  static getOpportunities(blogId: string): OpportunityModel[] {
    const filePath = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'opportunities', 'opportunities.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return [];
  }

  static getHighPriority(blogId: string): OpportunityModel[] {
    const all = this.getOpportunities(blogId);
    return all.filter(o => o.prioridade === 'Muito Alta' || o.prioridade === 'Alta');
  }

  static async generate(blogId: string): Promise<OpportunityModel[]> {
    return await OpportunityEngine.runWorkflow(blogId);
  }
}
