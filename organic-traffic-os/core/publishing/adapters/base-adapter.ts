import { PublicationPackage } from '../../agents/publishing-agent/publishing-agent.types';
import { AdapterContext, AdapterResult } from './adapter-types';

export interface BaseAdapter {
  id: string;
  name: string;
  export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult>;
}
