import { ComponentHealth, Alert, Incident, OperationsStatus } from './operations.types';
import { operationsEngine } from './operations-engine';

class OOCService {
  private engine = operationsEngine;

  initialize() { this.engine.initialize(); }
  getStatus(): OperationsStatus { return this.engine.getStatus(); }
  getComponents(): ComponentHealth[] { return this.engine.getComponents(); }
  getAlerts(): Alert[] { return this.engine.getAlerts(); }
  getIncidents(): Incident[] { return this.engine.getIncidents(); }
  acknowledgeAlert(alertId: string): boolean { return this.engine.acknowledgeAlert(alertId); }
  recheck() { this.engine.recheck(); }
}

export const oocService = new OOCService();
