import { ConnectorContext } from './connector-context';
import { ConnectorResult } from './connector-result';
import { CoreStatus } from '../types';

export interface BaseConnector {
  id: string;
  name: string;
  version: string;
  status: CoreStatus;
  connect(ctx: ConnectorContext): Promise<ConnectorResult<boolean>>;
  validate(payload: any): boolean;
  execute(query: any, ctx: ConnectorContext): Promise<ConnectorResult<any>>;
  normalize(rawData: any): any;
}
