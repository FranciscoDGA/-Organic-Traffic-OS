import fs from 'fs';
import path from 'path';

export interface KeywordValidationResult {
  isValid: boolean;
  errors: string[];
}

export class KeywordValidator {
  static validate(blogId: string): KeywordValidationResult {
    const errors: string[] = [];
    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'keywords');

    if (!fs.existsSync(baseDir)) {
      return { isValid: false, errors: [`Diretório de keywords do blog '${blogId}' não encontrado.`] };
    }

    const requiredFiles = [
      'keyword.json',
      'keyword-intent.json',
      'keyword-priority.json',
      'clusters.json',
      'entities.json',
      'questions.json',
      'longtails.json',
      'opportunities.json'
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
