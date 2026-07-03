import fs from 'fs';
import path from 'path';

export interface CompetitorValidationResult {
  isValid: boolean;
  errors: string[];
}

export class CompetitorValidator {
  static validate(blogId: string): CompetitorValidationResult {
    const errors: string[] = [];
    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'competitors');

    if (!fs.existsSync(baseDir)) {
      return { isValid: false, errors: [`Diretório de concorrentes do blog '${blogId}' não encontrado.`] };
    }

    const requiredFiles = [
      'competitors.json',
      'competitor-profile.json',
      'content-strategy.json',
      'opportunity-map.json',
      'strengths-weaknesses.json'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(baseDir, file);
      if (!fs.existsSync(filePath)) {
        errors.push(`Arquivo obrigatório ausente: ${file}`);
        continue;
      }

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content); // Validating if JSON is well-formed
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
