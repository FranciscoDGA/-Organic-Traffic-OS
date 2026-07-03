import fs from 'fs';
import path from 'path';
import { OpportunityService } from '../../opportunities/engine/opportunity-service';
import { EditorialItem, CalendarItem, DependencyData, BacklogData, RoadmapData } from '../models/editorial-models';
import { EditorialRanking } from '../ranking/editorial-ranking';
import { EditorialRules } from '../rules/editorial-rules';

export class EditorialPlanner {
  static async generate(blogId: string): Promise<any> {
    const opps = OpportunityService.getOpportunities(blogId);
    
    // Simulate Context (in reality, read from dependencies.json and inventory)
    const context = {
      dependencies: [] as DependencyData[],
      publishedIds: [] as string[]
    };

    let editorialItems: EditorialItem[] = opps.map(op => {
      return {
        id: `ed-${op.id}`,
        titulo: op.titulo,
        cluster: op.cluster,
        categoria: op.categoria,
        tipo: op.tipo,
        prioridade: op.prioridade,
        score: op.score,
        dependencias: [], // Logic to map dependencies
        status: 'Backlog',
        estimativa: '1 dia',
        objetivo: `Ranqueamento para intenção ${op.intencao}`,
        cta: 'Assine nossa Newsletter'
      };
    });

    // Ranking and Rules
    editorialItems.forEach(item => {
      item.score = EditorialRanking.calculate(item, context);
    });
    editorialItems.sort((a, b) => b.score - a.score);

    editorialItems = EditorialRules.applyRules(editorialItems, context.publishedIds);

    // Split logic
    const calendar: CalendarItem[] = [];
    const backlog: BacklogData = {
      pendentes: [],
      em_planejamento: [],
      prontos: [],
      bloqueados: [],
      arquivados: []
    };
    const roadmap: RoadmapData = {
      curto_prazo: [],
      medio_prazo: [],
      longo_prazo: []
    };

    let dayOffset = 1;

    editorialItems.forEach((item, index) => {
      if (index < 10) { // Top 10 go to Calendar
        item.status = 'Agendado';
        
        const date = new Date();
        date.setDate(date.getDate() + dayOffset);
        dayOffset += 2; // Publish every 2 days

        calendar.push({
          id: `cal-${item.id}`,
          data: date.toISOString(),
          conteudo: item.id,
          categoria: item.categoria,
          cluster: item.cluster,
          status: 'Agendado',
          responsavel: 'AI Writer'
        });
        roadmap.curto_prazo.push(item);
      } else if (index < 30) {
        backlog.pendentes.push(item);
        roadmap.medio_prazo.push(item);
      } else {
        backlog.arquivados.push(item);
        roadmap.longo_prazo.push(item);
      }
    });

    this.saveData(blogId, 'editorial-item.json', editorialItems);
    this.saveData(blogId, 'calendar.json', calendar);
    this.saveData(blogId, 'backlog.json', backlog);
    this.saveData(blogId, 'roadmap.json', roadmap);
    this.saveData(blogId, 'dependencies.json', context.dependencies);

    return { calendar, backlog, roadmap };
  }

  private static saveData(blogId: string, filename: string, data: any) {
    const dir = path.join(process.cwd(), 'shared', 'knowledge', 'blogs', blogId, 'editorial');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(path.join(dir, filename), JSON.stringify(data, null, 2));
  }
}
