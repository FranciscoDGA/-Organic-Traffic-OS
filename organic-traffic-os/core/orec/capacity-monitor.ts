import { CapacityMetrics } from './reliability.types';

export function generateCapacityMetrics(): CapacityMetrics {
  return {
    cpuUsage: parseFloat((30 + Math.random() * 40).toFixed(1)),
    memoryUsage: parseFloat((40 + Math.random() * 30).toFixed(1)),
    storageUsage: parseFloat((20 + Math.random() * 30).toFixed(1)),
    queueDepth: Math.floor(Math.random() * 50),
    jobsRunning: Math.floor(Math.random() * 10),
    missionsRunning: Math.floor(Math.random() * 5),
    publicationsRunning: Math.floor(Math.random() * 3),
    aiConsumption: parseFloat((10 + Math.random() * 40).toFixed(1)),
    connectorUtilization: parseFloat((15 + Math.random() * 35).toFixed(1)),
  };
}
