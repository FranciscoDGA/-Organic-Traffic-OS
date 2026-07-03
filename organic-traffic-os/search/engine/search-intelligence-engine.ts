export class SearchIntelligenceEngine {
  public analyzeOpportunities(normalizedData: any[]) {
    const opps: any[] = [];
    for (const row of normalizedData) {
      if (row.metrics.impressoes > 10000 && row.metrics.ctr < 2.0) {
        opps.push({
          tipo: "Alta Impressao + Baixo CTR",
          query: row.query,
          metrica_foco: `CTR atual: ${row.metrics.ctr}%`,
          urgencia: "Alta"
        });
      }
      if (row.metrics.posicao_media > 10.0 && row.metrics.posicao_media < 20.0 && row.metrics.impressoes > 5000) {
        opps.push({
          tipo: "Striking Distance (Pag 2)",
          query: row.query,
          metrica_foco: `Posicao atual: ${row.metrics.posicao_media}`,
          urgencia: "Media"
        });
      }
    }
    return opps;
  }
}
