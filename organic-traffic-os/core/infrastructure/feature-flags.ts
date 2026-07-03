export type FeatureFlag =
  | 'ENABLE_SANDBOX'
  | 'ENABLE_STAGING'
  | 'ENABLE_PRODUCTION'
  | 'ENABLE_AUTOPUBLISH'
  | 'ENABLE_REAL_PUBLISH'
  | 'ENABLE_FAKE_DATA';

export interface FeatureFlagConfig {
  flag: FeatureFlag;
  enabled: boolean;
  description: string;
  environment: string;
  updatedAt: string;
}

const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  ENABLE_SANDBOX: true,
  ENABLE_STAGING: true,
  ENABLE_PRODUCTION: false,
  ENABLE_AUTOPUBLISH: false,
  ENABLE_REAL_PUBLISH: false,
  ENABLE_FAKE_DATA: true,
};

const flagDescriptions: Record<FeatureFlag, string> = {
  ENABLE_SANDBOX: 'Enable sandbox environment for testing',
  ENABLE_STAGING: 'Enable staging environment for homologation',
  ENABLE_PRODUCTION: 'Enable production environment',
  ENABLE_AUTOPUBLISH: 'Enable automatic publishing without confirmation',
  ENABLE_REAL_PUBLISH: 'Enable real publishing to external blogs',
  ENABLE_FAKE_DATA: 'Enable fake data generation for testing',
};

class FeatureFlagStore {
  private flags: Map<FeatureFlag, FeatureFlagConfig> = new Map();

  constructor() {
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
    for (const [flag, enabled] of Object.entries(DEFAULT_FLAGS)) {
      this.flags.set(flag as FeatureFlag, {
        flag: flag as FeatureFlag,
        enabled,
        description: flagDescriptions[flag as FeatureFlag],
        environment: env,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  isEnabled(flag: FeatureFlag): boolean {
    return this.flags.get(flag)?.enabled ?? false;
  }

  set(flag: FeatureFlag, enabled: boolean): void {
    const existing = this.flags.get(flag);
    this.flags.set(flag, {
      flag,
      enabled,
      description: flagDescriptions[flag],
      environment: existing?.environment || 'development',
      updatedAt: new Date().toISOString(),
    });
  }

  getAll(): FeatureFlagConfig[] {
    return Array.from(this.flags.values());
  }

  get(flag: FeatureFlag): FeatureFlagConfig | undefined {
    return this.flags.get(flag);
  }

  reset(): void {
    for (const [flag, enabled] of Object.entries(DEFAULT_FLAGS)) {
      this.set(flag as FeatureFlag, enabled);
    }
  }
}

export const featureFlags = new FeatureFlagStore();

export function isSandboxEnabled(): boolean { return featureFlags.isEnabled('ENABLE_SANDBOX'); }
export function isStagingEnabled(): boolean { return featureFlags.isEnabled('ENABLE_STAGING'); }
export function isProductionEnabled(): boolean { return featureFlags.isEnabled('ENABLE_PRODUCTION'); }
export function isAutopublishEnabled(): boolean { return featureFlags.isEnabled('ENABLE_AUTOPUBLISH'); }
export function isRealPublishEnabled(): boolean { return featureFlags.isEnabled('ENABLE_REAL_PUBLISH'); }
export function isFakeDataEnabled(): boolean { return featureFlags.isEnabled('ENABLE_FAKE_DATA'); }
