import { BaseEngine } from './base-engine';
export interface EngineFactory { create(type: string): BaseEngine; }
