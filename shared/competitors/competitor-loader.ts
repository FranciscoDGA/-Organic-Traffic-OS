import fs from 'fs';
import path from 'path';
import { CompetitorValidator } from './competitor-validator';

export class CompetitorLoader {
  static load(blogId: string): any {
    const validation = CompetitorValidator.validate(blogId);
    
    if (!validation.isValid) {
      throw new Error(`Falha na validação de Concorrentes para '${blogId}':\n${validation.errors.join('\n')}`);
    }

    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'competitors');

    const readJson = (file: string) => {
      const content = fs.readFileSync(path.join(baseDir, file), 'utf-8');
      return JSON.parse(content);
    };

    return {
      competitors: readJson('competitors.json'),
      profiles: readJson('competitor-profile.json'),
      content_strategies: readJson('content-strategy.json'),
      opportunity_map: readJson('opportunity-map.json'),
      strengths_weaknesses: readJson('strengths-weaknesses.json')
    };
  }
}
