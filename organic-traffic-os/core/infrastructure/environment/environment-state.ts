export interface EnvironmentState {
  current: 'development' | 'sandbox' | 'staging' | 'production';
  sandbox: { active: boolean; lastReset: string; testRuns: number; };
  staging: { active: boolean; lastDeployment: string; validated: boolean; };
  production: { active: boolean; lastDeployment: string; version: string; };
  promotionHistory: PromotionRecord[];
}

export interface PromotionRecord {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'validated' | 'promoted' | 'rejected';
  validatedBy?: string;
  promotedAt?: string;
  notes?: string;
  createdAt: string;
}

const state: EnvironmentState = {
  current: 'development',
  sandbox: { active: true, lastReset: new Date().toISOString(), testRuns: 0 },
  staging: { active: true, lastDeployment: new Date().toISOString(), validated: false },
  production: { active: false, lastDeployment: '', version: '1.0.0' },
  promotionHistory: [],
};

export function getEnvironmentState(): EnvironmentState {
  return { ...state, promotionHistory: [...state.promotionHistory] };
}

export function promote(from: string, to: string, notes?: string): PromotionRecord {
  const record: PromotionRecord = {
    id: `promo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    from,
    to,
    status: 'validated',
    validatedBy: 'system',
    promotedAt: new Date().toISOString(),
    notes,
    createdAt: new Date().toISOString(),
  };
  state.promotionHistory.unshift(record);
  if (to === 'production') {
    state.production.active = true;
    state.production.lastDeployment = new Date().toISOString();
  }
  return record;
}

export function resetSandbox(): void {
  state.sandbox.lastReset = new Date().toISOString();
  state.sandbox.testRuns = 0;
}

export function incrementSandboxRuns(): void {
  state.sandbox.testRuns++;
}
