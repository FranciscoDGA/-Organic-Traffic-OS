import { CoreLog, CoreLayer } from '../types';
export class Logger {
  public log(level: CoreLog['level'], layer: CoreLayer, message: string, meta?: any) {
    const entry: CoreLog = { level, layer, message, meta, timestamp: new Date().toISOString() };
    console.log(`[${entry.timestamp}] [${layer.toUpperCase()}] ${message}`);
  }
}
