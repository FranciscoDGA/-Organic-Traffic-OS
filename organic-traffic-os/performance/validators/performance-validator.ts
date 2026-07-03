export class PerformanceValidator {
  public validateMetrics(metrics: any) {
    return metrics && typeof metrics.visualizacoes === 'number';
  }
}
