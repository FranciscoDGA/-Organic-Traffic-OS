import { ValidationMission, ValidationReport } from './validation.types';
import { validationEngine } from './validation-engine';

class OEVService {
  private engine = validationEngine;

  runValidation(): ValidationMission { return this.engine.runMission(); }
  getMission(id: string): ValidationMission | undefined { return this.engine.getMission(id); }
  getAllMissions(): ValidationMission[] { return this.engine.getAllMissions(); }
  getLatest(): ValidationMission | undefined { return this.engine.getLatest(); }
  getTimeline(missionId: string): ValidationMission | undefined { return this.engine.getMission(missionId); }
  getReport(missionId: string): ValidationReport | undefined {
    const mission = this.engine.getMission(missionId);
    return mission ? this.engine.generateReport(mission) : undefined;
  }
  replay(missionId: string): ValidationMission | undefined {
    const existing = this.engine.getMission(missionId);
    if (!existing) return undefined;
    return this.engine.runMission();
  }
}

export const oevService = new OEVService();
