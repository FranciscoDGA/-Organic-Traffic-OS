import fs from 'fs';
import path from 'path';

export interface InventoryValidationResult {
  isValid: boolean;
  errors: string[];
}

export class InventoryValidator {
  static validate(blogId: string): InventoryValidationResult {
    const errors: string[] = [];
    const baseDir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'inventory');

    if (!fs.existsSync(baseDir)) {
      return { isValid: false, errors: [`Diretório de inventário do blog '${blogId}' não encontrado.`] };
    }

    const requiredFiles = [
      'content-index.json',
      'content-health.json',
      'content-gaps.json',
      'duplicate-content.json',
      'orphan-pages.json',
      'broken-links.json'
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
