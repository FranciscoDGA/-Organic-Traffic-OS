export type Severity = 'OK' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface DiagnosticItem {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  description: string;
  impact: string;
  recommendation: string;
  documentation_link: string;
  checked_at: string;
}

export interface ValidationReport {
  timestamp: string;
  overall_health_score: number;
  scores: {
    infrastructure: number;
    database: number;
    storage: number;
    publishing: number;
    workspace: number;
    security: number;
  };
  diagnostics: DiagnosticItem[];
}
