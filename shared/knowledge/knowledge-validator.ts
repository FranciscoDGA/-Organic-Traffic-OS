import fs from 'fs';
import path from 'path';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class KnowledgeValidator {
  static validateBlogKnowledge(blogId: string): ValidationResult {
    const errors: string[] = [];
    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId);

    if (!fs.existsSync(baseDir)) {
      return { isValid: false, errors: [`Diretório do blog '${blogId}' não encontrado.`] };
    }

    const requiredFiles = [
      '01-blog-profile.json',
      '02-target-audience.json',
      '03-editorial-guidelines.json',
      '04-categories.json',
      '05-products.json',
      '06-content-rules.json',
      '07-writing-style.json',
      '08-seo-rules.json',
      '09-knowledge-index.json'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(baseDir, file);
      if (!fs.existsSync(filePath)) {
        errors.push(`Arquivo obrigatório ausente: ${file}`);
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
      } catch (e: any) {
        errors.push(`Arquivo ${file} possui JSON inválido: ${e.message}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
