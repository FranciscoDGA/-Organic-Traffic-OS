export class OpportunityValidator {
  static validate(opportunities: any[]): boolean {
    if (!Array.isArray(opportunities)) return false;
    for (const op of opportunities) {
      if (!op.id || !op.titulo || typeof op.score !== 'number') return false;
    }
    return true;
  }
}
