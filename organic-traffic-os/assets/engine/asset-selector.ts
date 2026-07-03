export class AssetSelector {
  public determineBestFormat(intent: string, strategy: any) {
    if (intent === 'transactional') return 'Landing Page';
    if (intent === 'navigational') return 'Página Pilar';
    if (strategy.objetivo === 'lead') return 'Checklist';
    return 'Artigo Satélite';
  }
}
