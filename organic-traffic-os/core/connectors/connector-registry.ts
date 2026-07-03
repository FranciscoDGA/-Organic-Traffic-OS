import { BaseConnector } from './base-connector';
export class ConnectorRegistry {
  private items = new Map<string, BaseConnector>();
  register(connector: BaseConnector) { this.items.set(connector.id, connector); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
