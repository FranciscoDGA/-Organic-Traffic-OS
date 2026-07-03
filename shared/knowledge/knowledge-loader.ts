import fs from 'fs';
import path from 'path';
import { KnowledgeValidator } from './knowledge-validator';

export class KnowledgeLoader {
  static loadBlogKnowledge(blogId: string): any {
    const validation = KnowledgeValidator.validateBlogKnowledge(blogId);
    
    if (!validation.isValid) {
      throw new Error(`Falha na validação do Knowledge Core para '${blogId}':\n${validation.errors.join('\n')}`);
    }

    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId);

    const readJson = (file: string) => {
      const content = fs.readFileSync(path.join(baseDir, file), 'utf-8');
      return JSON.parse(content);
    };

    return {
      blog: readJson('01-blog-profile.json'),
      publico: readJson('02-target-audience.json'),
      editorial: readJson('03-editorial-guidelines.json'),
      categorias: readJson('04-categories.json'),
      produtos: readJson('05-products.json'),
      regras: readJson('06-content-rules.json'),
      writing_style: readJson('07-writing-style.json'),
      seo: readJson('08-seo-rules.json'),
      index: readJson('09-knowledge-index.json'),
    };
  }
}
