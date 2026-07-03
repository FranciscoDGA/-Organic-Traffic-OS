import { PerformanceEngine } from './performance-engine';
import { PerformanceValidator } from '../validators/performance-validator';

export class PerformanceService {
  private engine = new PerformanceEngine();
  private validator = new PerformanceValidator();

  public registerAndAnalyze(data: any) {
    if (!this.validator.validateMetrics(data.metrics)) throw new Error("Invalid metrics format");
    
    const analysis = this.engine.analyzeMetrics(data.metrics);
    const recommendations = this.engine.generateRecommendations(analysis);
    const priority = this.engine.calculatePriority(analysis);
    
    return {
      content_id: data.content_id,
      analysis,
      recommendations,
      priority,
      status: analysis.trend === 'Queda' ? 'Decay' : 'Healthy'
    };
  }

  public getDashboardOverview() {
    return {
      total_monitorados: 42,
      top_performers: [
        { title: "Guia Completo Cumaru", vis: 15400, trend: "Alta" }
      ],
      alertas_queda: [
        { title: "Checklist Antigo", vis: 120, trend: "Queda", recommendations: ["Atualizar conteúdo"] }
      ]
    };
  }

  public getHistory(contentId: string) {
    return { content_id: contentId, status: "Healthy" };
  }
}
