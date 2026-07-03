import fs from 'fs';
import path from 'path';
import { BriefEngine } from './brief-engine';
import { BriefLoader } from './brief-loader';

export class BriefService {
  static async createBrief(blogId: string, itemId: string, itemTitle: string) {
    return await BriefEngine.generateBrief(blogId, itemId, itemTitle);
  }

  static getBrief(blogId: string, briefId: string) {
    const dir = BriefLoader.getBriefDir(blogId, briefId);
    if (!fs.existsSync(dir)) return null;

    return {
      template: BriefLoader.readJson(path.join(dir, 'brief-template.json')),
      seo: BriefLoader.readJson(path.join(dir, 'seo-brief.json')),
      outline: BriefLoader.readJson(path.join(dir, 'outline.json'))
    };
  }

  static getAllBriefs(blogId: string) {
    const dir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'briefs');
    if (!fs.existsSync(dir)) return [];

    const briefs: any[] = [];
    const dirs = fs.readdirSync(dir);
    for (const d of dirs) {
      const templatePath = path.join(dir, d, 'brief-template.json');
      if (fs.existsSync(templatePath)) {
        briefs.push(BriefLoader.readJson(templatePath));
      }
    }
    return briefs;
  }
}
