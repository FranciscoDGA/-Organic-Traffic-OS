export type MissionType = 'new_article' | 'update' | 'refresh' | 'campaign' | 'pillar_page' | 'faq' | 'case_study' | 'newsletter' | 'seasonal';
export type MissionPriority = 'urgent' | 'high' | 'normal' | 'low' | 'background';
export type DailyStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface DailyMission {
  id: string;
  type: MissionType;
  workspaceId: string;
  title: string;
  description: string;
  priority: MissionPriority;
  estimatedDuration: number;
  estimatedCost: number;
  reason: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'publication' | 'campaign' | 'seasonal' | 'deadline' | 'review';
  workspaceId: string;
  description: string;
}

export interface DailyBriefing {
  date: string;
  summary: string;
  yesterdayResults: { published: number; updated: number; missionsCompleted: number };
  alerts: string[];
  opportunities: string[];
  missionsCreated: number;
  plannedPublications: number;
  activeCampaigns: number;
  recommendations: string[];
}

export interface DailyOperations {
  date: string;
  status: DailyStatus;
  workspacesChecked: number;
  activeWorkspaces: string[];
  missions: DailyMission[];
  calendar: CalendarEvent[];
  briefing: DailyBriefing;
  startedAt?: string;
  completedAt?: string;
}

export interface WorkspaceDailyCheck {
  workspaceId: string;
  active: boolean;
  pendingContents: number;
  outdatedContents: number;
  activeCampaigns: number;
  budgetAvailable: boolean;
  publicationLimit: number;
  publicationsToday: number;
}
