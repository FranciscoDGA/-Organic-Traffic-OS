export interface WizardStep {
  step_number: number;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'blocked';
  estimated_time_minutes: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  platform: string;
  documentation_link: string;
  items: {
    key: string;
    description: string;
    completed: boolean;
    mandatory: boolean;
  }[];
}

export interface WizardStatus {
  timestamp: string;
  overall_progress_percent: number;
  completed_steps: number;
  pending_steps: number;
  critical_blocks: number;
  readiness_scores: {
    infrastructure: number;
    database: number;
    storage: number;
    providers: number;
    publishing: number;
    workspaces: number;
    overall: number;
  };
  steps: WizardStep[];
}
