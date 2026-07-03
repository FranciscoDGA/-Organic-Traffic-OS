export class PlannerValidator {
  static validate(items: any[]): boolean {
    if (!Array.isArray(items)) return false;
    for (const item of items) {
      if (!item.id || !item.titulo) return false;
    }
    return true;
  }
}
