import { DailyOperations, WorkspaceDailyCheck, DailyMission } from './daily-operations.types';
import { generateMissions, prioritizeMissions } from './mission-generator';
import { generateBriefing } from './briefing-generator';
import { getEventsForDate } from './calendar-data';

const workspaceChecks: WorkspaceDailyCheck[] = [
  { workspaceId: 'passacumaru', active: true, pendingContents: 3, outdatedContents: 2, activeCampaigns: 0, budgetAvailable: true, publicationLimit: 2, publicationsToday: 0 },
  { workspaceId: 'qualoseguro', active: true, pendingContents: 4, outdatedContents: 1, activeCampaigns: 1, budgetAvailable: true, publicationLimit: 3, publicationsToday: 1 },
  { workspaceId: 'utilprobrasil', active: true, pendingContents: 2, outdatedContents: 3, activeCampaigns: 0, budgetAvailable: true, publicationLimit: 3, publicationsToday: 0 },
  { workspaceId: 'tabuometro', active: true, pendingContents: 5, outdatedContents: 4, activeCampaigns: 0, budgetAvailable: true, publicationLimit: 4, publicationsToday: 2 },
  { workspaceId: 'aiagencyos', active: true, pendingContents: 2, outdatedContents: 1, activeCampaigns: 1, budgetAvailable: true, publicationLimit: 2, publicationsToday: 0 },
];

class DOCService {
  private operations: Map<string, DailyOperations> = new Map();

  startDay(date?: string): DailyOperations {
    const day = date || new Date().toISOString().split('T')[0];
    const checks = workspaceChecks;
    const activeWorkspaces = checks.filter(c => c.active).map(c => c.workspaceId);
    let missions = generateMissions(checks);
    missions = prioritizeMissions(missions);
    const calendar = getEventsForDate(day);
    const briefing = generateBriefing(day, missions.length);

    const ops: DailyOperations = {
      date: day, status: 'completed', workspacesChecked: checks.length, activeWorkspaces, missions, calendar, briefing,
      startedAt: new Date().toISOString(), completedAt: new Date().toISOString(),
    };
    this.operations.set(day, ops);
    return ops;
  }

  getDay(date: string): DailyOperations | undefined { return this.operations.get(date); }
  getLatest(): DailyOperations | undefined { return Array.from(this.operations.values()).pop(); }
  getAll(): DailyOperations[] { return Array.from(this.operations.values()); }
  getMissions(date: string): DailyMission[] { return this.operations.get(date)?.missions || []; }
  getCalendar(date: string) { return getEventsForDate(date); }
}

export const docService = new DOCService();
