export class PerformanceEngine {
  public analyzeMetrics(metrics: any) {
    let trend = "Estabilidade";
    if (metrics.visualizacoes < 100 && metrics.ctr < 2.0) {
      trend = "Queda";
    } else if (metrics.visualizacoes > 1000) {
      trend = "Alta";
    }
    
    return {
      trend,
      percentual_variacao: trend === "Queda" ? -12.5 : 5.0,
      fator_decaimento: trend === "Queda" ? "CTR_Baixo" : "Nenhum"
    };
  }

  public generateRecommendations(trendAnalysis: any) {
    if (trendAnalysis.trend === "Queda") {
      return ["Atualizar conteúdo", "Melhorar CTA", "Adicionar vídeo"];
    }
    if (trendAnalysis.trend === "Alta") {
      return ["Criar artigo satélite", "Criar Quiz"];
    }
    return ["Monitorar"];
  }

  public calculatePriority(trendAnalysis: any) {
    if (trendAnalysis.trend === "Queda") return { urgencia: 9, impacto: 8, rice_score: 200 };
    return { urgencia: 2, impacto: 5, rice_score: 50 };
  }
}
