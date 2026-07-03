import fs from 'fs';
import path from 'path';

export class BriefLoader {
  static getBriefDir(blogId: string, briefId: string): string {
    return path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'briefs', briefId);
  }

  static readJson(filepath: string): any {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    }
    return null;
  }
}
