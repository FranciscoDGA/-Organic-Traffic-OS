import fs from 'fs';
import path from 'path';
import { KeywordValidator } from './keyword-validator';

export class KeywordLoader {
  static load(blogId: string): any {
    const validation = KeywordValidator.validate(blogId);
    
    if (!validation.isValid) {
      throw new Error(`Falha na validação de Keywords para '${blogId}':\n${validation.errors.join('\n')}`);
    }

    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'keywords');

    const readJson = (file: string) => {
      const content = fs.readFileSync(path.join(baseDir, file), 'utf-8');
      return JSON.parse(content);
    };

    return {
      keywords: readJson('keyword.json'),
      intents: readJson('keyword-intent.json'),
      priorities: readJson('keyword-priority.json'),
      clusters: readJson('clusters.json'),
      entities: readJson('entities.json'),
      questions: readJson('questions.json'),
      longtails: readJson('longtails.json'),
      opportunities: readJson('opportunities.json')
    };
  }
}
