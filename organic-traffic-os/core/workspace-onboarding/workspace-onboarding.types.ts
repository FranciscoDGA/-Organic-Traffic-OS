export type WorkspaceStatus = 'inactive' | 'active' | 'suspended' | 'maintenance';
export type PublishMode = 'manual' | 'automatic' | 'scheduled' | 'sandbox' | 'staging' | 'production';
export type WorkspaceType = 'blog' | 'saas' | 'ecommerce' | 'agency' | 'education' | 'news' | 'portfolio';

export interface WorkspaceIdentity {
  id: string;
  name: string;
  domain: string;
  niche: string;
  type: WorkspaceType;
  status: WorkspaceStatus;
  language: string;
  country: string;
  timezone: string;
  objective: string;
  targetAudience: string;
  monetization: string;
  publishMode: PublishMode;
  publisherAdapter: string;
  organicBridgeEndpoint: string;
  created_at: string;
  updated_at: string;
}

export interface EditorialProfile {
  voiceTone: string;
  depthLevel: string;
  defaultArticleSize: string;
  mainCategories: string[];
  allowedContentTypes: string[];
  allowedCTAs: string[];
  forbiddenThemes: string[];
  adSenseRules: string[];
  seoRules: string[];
  aiVisibilityRules: string[];
}

export interface WorkspacePolicy {
  requireHumanApproval: boolean;
  autoPublishEnabled: boolean;
  maxPostsPerDay: number;
  preferredPublishDays: string[];
  preferredPublishTime: string;
  minWordsPerArticle: number;
  maxWordsPerArticle: number;
  requiredSections: string[];
}

export interface PublisherConfig {
  publish_endpoint: string;
  preview_endpoint: string;
  approve_endpoint: string;
  revalidate_endpoint: string;
  api_secret_reference: string;
  allowed_origin: string;
  auto_publish_enabled: boolean;
  require_human_approval: boolean;
  max_posts_per_day: number;
  preferred_publish_days: string[];
  preferred_publish_time: string;
}

export interface WorkspaceKPI {
  id: string;
  name: string;
  target: number;
  unit: string;
}

export interface WorkspaceConfig {
  identity: WorkspaceIdentity;
  editorialProfile: EditorialProfile;
  policy: WorkspacePolicy;
  publisherConfig: PublisherConfig;
  kpis: WorkspaceKPI[];
}
