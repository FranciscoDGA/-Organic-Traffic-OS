import { ComponentHealth, Alert, Incident, OperationsStatus, ComponentStatus } from './operations.types';
import { allComponents } from './health-data';
import { generateAlerts } from './alert-engine';
import { generateIncidents } from './incident-engine';

let componentCounter = 0;

function assignIds(components: Omit<ComponentHealth, 'id'>[]): ComponentHealth[] {
  return components.map(c => ({ ...c, id: `comp-${++componentCounter}` }));
}

function calculateOverallStatus(components: ComponentHealth[]): ComponentStatus {
  const statuses = components.map(c => c.status);
  if (statuses.includes('offline')) return 'offline';
  if (statuses.includes('unhealthy')) return 'unhealthy';
  if (statuses.includes('degraded')) return 'degraded';
  return 'healthy';
}

export class OperationsEngine {
  private components: ComponentHealth[] = [];
  private alerts: Alert[] = [];
  private incidents: Incident[] = [];

  initialize() {
    this.components = assignIds(allComponents);
    this.alerts = generateAlerts(8);
    this.incidents = generateIncidents(3);
  }

  getStatus(): OperationsStatus {
    if (this.components.length === 0) this.initialize();
    const healthy = this.components.filter(c => c.status === 'healthy').length;
    const degraded = this.components.filter(c => c.status === 'degraded').length;
    const unhealthy = this.components.filter(c => c.status === 'unhealthy').length;
    const offline = this.components.filter(c => c.status === 'offline').length;
    const activeAlerts = this.alerts.filter(a => !a.acknowledged).length;
    const openIncidents = this.incidents.filter(i => i.status === 'open').length;
    const avgAvailability = Math.round(this.components.reduce((s, c) => s + c.availability, 0) / this.components.length * 10) / 10;
    return {
      overallStatus: calculateOverallStatus(this.components),
      totalComponents: this.components.length, healthy, degraded, unhealthy, offline,
      activeAlerts, openIncidents, uptime: avgAvailability,
    };
  }

  getComponents(): ComponentHealth[] { if (this.components.length === 0) this.initialize(); return this.components; }
  getAlerts(): Alert[] { if (this.alerts.length === 0) this.alerts = generateAlerts(8); return this.alerts; }
  getIncidents(): Incident[] { if (this.incidents.length === 0) this.incidents = generateIncidents(3); return this.incidents; }

  acknowledgeAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) return false;
    alert.acknowledged = true;
    alert.acknowledgedAt = new Date().toISOString();
    return true;
  }

  recheck() { this.components = assignIds(allComponents); this.alerts = generateAlerts(8); this.incidents = generateIncidents(3); }
}

export const operationsEngine = new OperationsEngine();
