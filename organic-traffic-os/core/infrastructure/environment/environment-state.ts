export function getEnvironmentState(): any {
  return { env: 'development', sandbox: false };
}

export function resetSandbox(): any {
  return { status: 'ok' };
}

export function promote(): any {
  return { status: 'ok' };
}
