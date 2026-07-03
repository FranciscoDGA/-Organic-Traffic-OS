export interface KnowledgeProfile {
  workspaceId: string;
  name: string;
  description: string;
  objective: string;
  mission: string;
  vision: string;
  niche: string;
  subniches: string[];
  toneOfVoice: string;
  language: string;
  country: string;
  desiredAuthority: string;
  editorialStrategy: string;
  commercialObjective: string;
  seoObjective: string;
  aiVisibilityObjective: string;
}

export interface WorkspaceMemory {
  workspaceId: string;
  publishedContents: string[];
  clusters: string[];
  entities: string[];
  faqs: string[];
  glossary: string[];
  rules: string[];
  history: string[];
  strategies: string[];
  lessonsLearned: string[];
  knownErrors: string[];
  bestPractices: string[];
}

export interface EditorialStyle {
  workspaceId: string;
  toneOfVoice: string;
  technicalLevel: string;
  complexity: string;
  preferredFormat: string;
  articleStructure: string[];
  averageSize: string;
  ctaPattern: string;
  useTables: boolean;
  useLists: boolean;
  useExamples: boolean;
  useQuotes: boolean;
}

export interface Taxonomy {
  workspaceId: string;
  categories: Category[];
  tags: string[];
  contentTypes: string[];
  clusters: string[];
  pillarPages: string[];
  relationships: Relationship[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
  relationships: string[];
  importance: number;
  synonyms: string[];
  required: boolean;
}

export interface Persona {
  id: string;
  name: string;
  objective: string;
  knowledgeLevel: string;
  problems: string[];
  pains: string[];
  frequentQuestions: string[];
  searchIntent: string;
  goals: string[];
  language: string;
}

export interface WorkspaceObjectives {
  workspaceId: string;
  commercial: string;
  seo: string;
  aiVisibility: string;
  content: string;
  authority: string;
}

export interface WorkspaceRules {
  workspaceId: string;
  contentRules: string[];
  editorialRules: string[];
  seoRules: string[];
  brandRules: string[];
  complianceRules: string[];
}

export interface WorkspaceKnowledgeContext {
  profile: KnowledgeProfile;
  memory: WorkspaceMemory;
  editorialStyle: EditorialStyle;
  taxonomy: Taxonomy;
  entities: Entity[];
  personas: Persona[];
  objectives: WorkspaceObjectives;
  rules: WorkspaceRules;
}
