export type ToneStyle = 'formal' | 'conversational' | 'didatic' | 'editorial' | 'institutional' | 'technical' | 'inspirational';

export interface EditorialPersona {
  id: string;
  name: string;
  goals: string[];
  painPoints: string[];
  questions: string[];
  language: string;
  knowledgeLevel: string;
  searchIntent: string[];
  objections: string[];
  preferredCTAs: string[];
}

export interface EditorialCategory {
  id: string;
  name: string;
  subcategories: string[];
  clusters: string[];
  pillar: string;
}

export interface EditorialRules {
  priorityThemes: string[];
  forbiddenThemes: string[];
  minWordCount: number;
  recommendedWordCount: number;
  useFAQ: boolean;
  useTables: boolean;
  useSchema: boolean;
  requiredCTAs: string[];
  editorialPolicies: string[];
  adSensePolicies: string[];
}

export interface MonetizationConfig {
  primaryMethod: string;
  secondaryMethods: string[];
  ctaFocus: string[];
  conversionGoals: string[];
}

export interface WorkspaceEditorialProfile {
  id: string;
  workspaceId: string;
  name: string;
  niche: string;
  mission: string;
  vision: string;
  objectives: string[];
  targetAudience: string;
  personas: EditorialPersona[];
  technicalLevel: string;
  toneOfVoice: ToneStyle[];
  depthLevel: string;
  preferredFormat: string;
  averageArticleSize: string;
  monetization: MonetizationConfig;
  primaryCTA: string;
  publicationFrequency: string;
  language: string;
  country: string;
  categories: EditorialCategory[];
  rules: EditorialRules;
  version: string;
  updatedAt: string;
}
