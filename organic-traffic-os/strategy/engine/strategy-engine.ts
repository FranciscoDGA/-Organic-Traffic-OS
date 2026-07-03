export class StrategyEngine {
  public defineStrategy(data: any) {
    return { id: "strategy-id", status: "Generated", ...data };
  }
  public selectApproach(intention: string) {
    return "informativo";
  }
  public defineGoal() {
    return "Capturar lead";
  }
  public selectCTA() {
    return { principal: "Assine", secundario: "Leia mais" };
  }
  public defineNarrative() {
    return "Narrativa de superação focada na dor";
  }
}
