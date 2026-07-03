import { ComponentHealth, ComponentStatus } from './operations.types';

const workspaces = ['PassaCumaru', 'Qual o Seguro', 'UtilPro Brasil', 'Tabuometro', 'AI Agency OS'];
const agents = ['Writing Agent', 'Editor Agent', 'QA Agent', 'Compliance Agent', 'SEO Agent', 'Research Agent', 'Newsletter Agent', 'Analytics Agent'];

function randomLatency(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomStatus(): ComponentStatus { const r = Math.random(); return r > 0.9 ? 'offline' : r > 0.7 ? 'unhealthy' : r > 0.3 ? 'degraded' : 'healthy'; }

export const infrastructureComponents: Omit<ComponentHealth, 'id'>[] = [
  { name: 'Next.js Server', category: 'infrastructure', status: 'healthy', availability: 99.9, uptime: 864000, latencyMs: randomLatency(10, 50), utilization: randomLatency(20, 60), version: '16.2.10', environment: 'sandbox' },
  { name: 'Database (Supabase)', category: 'infrastructure', status: 'healthy', availability: 99.95, uptime: 864000, latencyMs: randomLatency(5, 30), utilization: randomLatency(15, 45), version: '15.1', environment: 'sandbox' },
  { name: 'Storage (Supabase)', category: 'infrastructure', status: 'healthy', availability: 99.9, uptime: 864000, latencyMs: randomLatency(20, 80), utilization: randomLatency(10, 40), version: '1.0', environment: 'sandbox' },
];

export const runtimeComponents: Omit<ComponentHealth, 'id'>[] = [
  { name: 'ORE (Runtime Engine)', category: 'runtime', status: 'healthy', availability: 99.5, uptime: 860000, latencyMs: randomLatency(50, 200), utilization: randomLatency(30, 70), version: '1.0', environment: 'sandbox' },
  { name: 'OWO (Workflow Orchestrator)', category: 'runtime', status: 'healthy', availability: 99.5, uptime: 860000, latencyMs: randomLatency(30, 150), utilization: randomLatency(25, 65), version: '1.0', environment: 'sandbox' },
  { name: 'OMP (Mission Planner)', category: 'runtime', status: 'healthy', availability: 99.5, uptime: 860000, latencyMs: randomLatency(40, 180), utilization: randomLatency(20, 55), version: '1.0', environment: 'sandbox' },
  { name: 'OEB (Event Bus)', category: 'runtime', status: 'healthy', availability: 99.8, uptime: 863000, latencyMs: randomLatency(5, 25), utilization: randomLatency(15, 50), version: '1.0', environment: 'sandbox' },
  { name: 'Scheduler & Jobs', category: 'runtime', status: 'healthy', availability: 99.5, uptime: 860000, latencyMs: randomLatency(10, 40), utilization: randomLatency(10, 35), version: '1.0', environment: 'sandbox' },
];

export const connectorComponents: Omit<ComponentHealth, 'id'>[] = [
  { name: 'OCH (Connector Hub)', category: 'connectors', status: 'healthy', availability: 99.0, uptime: 858000, latencyMs: randomLatency(100, 400), utilization: randomLatency(20, 50), version: '1.0', environment: 'sandbox' },
  { name: 'Google Search Console', category: 'connectors', status: 'healthy', availability: 98.5, uptime: 855000, latencyMs: randomLatency(200, 600), utilization: randomLatency(10, 30), version: '1.0', environment: 'sandbox' },
  { name: 'Google Analytics 4', category: 'connectors', status: 'healthy', availability: 98.5, uptime: 855000, latencyMs: randomLatency(200, 500), utilization: randomLatency(10, 30), version: '1.0', environment: 'sandbox' },
  { name: 'Google Trends', category: 'connectors', status: 'healthy', availability: 95.0, uptime: 820000, latencyMs: randomLatency(300, 800), utilization: randomLatency(5, 20), version: '1.0', environment: 'sandbox' },
  { name: 'Bing Webmaster', category: 'connectors', status: 'healthy', availability: 98.0, uptime: 850000, latencyMs: randomLatency(150, 400), utilization: randomLatency(10, 25), version: '1.0', environment: 'sandbox' },
  { name: 'WordPress', category: 'connectors', status: 'healthy', availability: 97.0, uptime: 845000, latencyMs: randomLatency(200, 700), utilization: randomLatency(15, 40), version: '1.0', environment: 'sandbox' },
  { name: 'Headless CMS', category: 'connectors', status: 'healthy', availability: 96.0, uptime: 840000, latencyMs: randomLatency(150, 500), utilization: randomLatency(10, 35), version: '1.0', environment: 'sandbox' },
  { name: 'Newsletter', category: 'connectors', status: 'healthy', availability: 96.0, uptime: 840000, latencyMs: randomLatency(100, 300), utilization: randomLatency(5, 20), version: '1.0', environment: 'sandbox' },
];

export const aiComponents: Omit<ComponentHealth, 'id'>[] = [
  { name: 'AIL (AI Intelligence Layer)', category: 'ai', status: 'healthy', availability: 99.0, uptime: 858000, latencyMs: randomLatency(100, 400), utilization: randomLatency(20, 60), version: '1.0', environment: 'sandbox' },
  { name: 'Content Intelligence', category: 'ai', status: 'healthy', availability: 98.5, uptime: 855000, latencyMs: randomLatency(200, 600), utilization: randomLatency(15, 45), version: '1.0', environment: 'sandbox' },
  { name: 'Semantic Intelligence', category: 'ai', status: 'healthy', availability: 98.5, uptime: 855000, latencyMs: randomLatency(200, 600), utilization: randomLatency(15, 45), version: '1.0', environment: 'sandbox' },
  { name: 'Authority Intelligence', category: 'ai', status: 'healthy', availability: 98.0, uptime: 852000, latencyMs: randomLatency(200, 500), utilization: randomLatency(10, 40), version: '1.0', environment: 'sandbox' },
  { name: 'Opportunity Intelligence', category: 'ai', status: 'healthy', availability: 98.0, uptime: 852000, latencyMs: randomLatency(200, 500), utilization: randomLatency(10, 40), version: '1.0', environment: 'sandbox' },
  { name: 'Predictive Intelligence', category: 'ai', status: 'healthy', availability: 97.5, uptime: 850000, latencyMs: randomLatency(300, 800), utilization: randomLatency(10, 35), version: '1.0', environment: 'sandbox' },
];

export const allComponents = [...infrastructureComponents, ...runtimeComponents, ...connectorComponents, ...aiComponents];
