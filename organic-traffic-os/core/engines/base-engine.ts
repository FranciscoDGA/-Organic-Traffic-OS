import { EngineContext } from './engine-context';
import { EngineResult } from './engine-result';

export interface BaseEngine {
  id: string;
  name: string;
  version: string;
  analyze(data: any, ctx: EngineContext): Promise<EngineResult<any>>;
  score(data: any): number;
  recommend(analysis: any): any[];
}
