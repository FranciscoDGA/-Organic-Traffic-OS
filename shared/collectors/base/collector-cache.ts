import fs from 'fs';
import path from 'path';
import { CollectorResult } from './collector';

export class CollectorCache {
  private static cacheDir = path.join(process.cwd(), 'shared', 'collectors', '.cache');

  private static ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  static async salvar(result: CollectorResult): Promise<void> {
    this.ensureCacheDir();
    const filePath = path.join(this.cacheDir, `${result.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');
  }

  static async buscar(id: string): Promise<CollectorResult | null> {
    this.ensureCacheDir();
    const filePath = path.join(this.cacheDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    return null;
  }

  static async limpar(): Promise<void> {
    this.ensureCacheDir();
    const files = fs.readdirSync(this.cacheDir);
    for (const file of files) {
      fs.unlinkSync(path.join(this.cacheDir, file));
    }
  }

  static async listarTodos(): Promise<CollectorResult[]> {
    this.ensureCacheDir();
    const files = fs.readdirSync(this.cacheDir);
    return files.map(file => JSON.parse(fs.readFileSync(path.join(this.cacheDir, file), 'utf-8')));
  }
}
