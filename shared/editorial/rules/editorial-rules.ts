import { EditorialItem, DependencyData } from '../models/editorial-models';

export class EditorialRules {
  static isBlockedByDependency(item: EditorialItem, publishedIds: string[]): boolean {
    // Nunca criar artigo filho antes da página pilar.
    if (!item.dependencias || item.dependencias.length === 0) return false;

    // Se tem dependência, verifica se a dependência já foi publicada
    for (const dep of item.dependencias) {
      if (!publishedIds.includes(dep)) {
        return true; // Bloqueado
      }
    }
    return false;
  }

  static applyRules(items: EditorialItem[], publishedIds: string[]): EditorialItem[] {
    // Nunca publicar dois conteúdos iguais (já foi filtrado pela Opportunity Engine, mas pode-se reforçar aqui)
    return items.filter(item => {
      // Regra de bloqueio
      const blocked = this.isBlockedByDependency(item, publishedIds);
      if (blocked) {
        item.status = 'Backlog'; // Force backlog se bloqueado
      }
      return true; // Retorna true porque ele vai pro backlog, só não vai pro calendário
    });
  }
}
