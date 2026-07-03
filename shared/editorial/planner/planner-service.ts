import fs from 'fs';
import path from 'path';
import { EditorialPlanner } from './editorial-planner';

export class PlannerService {
  private static getFilePath(blogId: string, filename: string): string {
    return path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'editorial', filename);
  }

  private static readJson(filepath: string): any {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
    return null;
  }

  static getEditorialItems(blogId: string) {
    return this.readJson(this.getFilePath(blogId, 'editorial-item.json')) || [];
  }

  static getCalendar(blogId: string) {
    return this.readJson(this.getFilePath(blogId, 'calendar.json')) || [];
  }

  static getBacklog(blogId: string) {
    return this.readJson(this.getFilePath(blogId, 'backlog.json')) || {
      pendentes: [], em_planejamento: [], prontos: [], bloqueados: [], arquivados: []
    };
  }

  static getRoadmap(blogId: string) {
    return this.readJson(this.getFilePath(blogId, 'roadmap.json')) || {
      curto_prazo: [], medio_prazo: [], longo_prazo: []
    };
  }

  static getDependencies(blogId: string) {
    return this.readJson(this.getFilePath(blogId, 'dependencies.json')) || [];
  }

  static async generate(blogId: string) {
    return await EditorialPlanner.generate(blogId);
  }
}
