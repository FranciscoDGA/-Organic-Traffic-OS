import fs from 'fs';
import path from 'path';
import { InventoryValidator } from './inventory-validator';

export class InventoryLoader {
  static load(blogId: string): any {
    const validation = InventoryValidator.validate(blogId);
    
    if (!validation.isValid) {
      throw new Error(`Falha na validação do Inventário para '${blogId}':\n${validation.errors.join('\n')}`);
    }

    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'inventory');

    const readJson = (file: string) => {
      const content = fs.readFileSync(path.join(baseDir, file), 'utf-8');
      return JSON.parse(content);
    };

    return {
      content_index: readJson('content-index.json'),
      content_health: readJson('content-health.json'),
      content_gaps: readJson('content-gaps.json'),
      duplicate_content: readJson('duplicate-content.json'),
      orphan_pages: readJson('orphan-pages.json'),
      broken_links: readJson('broken-links.json')
    };
  }
}
