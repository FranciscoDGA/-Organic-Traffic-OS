const workspaceOnboardingService = new Proxy({}, { get: () => () => ({}) }) as any;

export function getWorkspaceOnboardingService() {
  return workspaceOnboardingService;
}
