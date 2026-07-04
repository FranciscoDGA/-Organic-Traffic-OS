export type QASeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type QAArea = 'mission' | 'workflow' | 'agent' | 'engine' | 'connector' | 'context' | 'knowledge' | 'memory' | 'content' | 'publishing' | 'scheduler' | 'runtime';

export interface QAIssue { id: string; area: QAArea; severity: QASeverity; title: string; description: string; recommendation: string; workspace_id?: string; created_at: string; }

export interface QualityScores { overall: number; content: number; workflow: number; agent: number; engine: number; operational: number; seo: number; ai_readiness: number; }

export interface QAReport { id: string; workspace_id?: string; target_type: string; target_id: string; scores: QualityScores; issues: QAIssue[]; recommendations: string[]; created_at: string; }
