import { BaseConnector } from './base-connector';
export interface ConnectorFactory {
  create(type: string, config: any): BaseConnector;
}
