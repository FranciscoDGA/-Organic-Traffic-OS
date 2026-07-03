export class WorkflowValidator {
  public validateDependencies(step: string) {
    return true;
  }
  public validateOrder(currentStep: string, nextStep: string) {
    return true;
  }
  public validateStateTransition(current: string, next: string) {
    return true;
  }
  public validateIntegrity(execution: any) {
    return true;
  }
}
