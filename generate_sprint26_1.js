const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'organic-traffic-os', 'core');
const dirsToCreate = [
  path.join(baseDir, 'types'),
  path.join(baseDir, 'events'),
  path.join(baseDir, 'errors'),
  path.join(baseDir, 'logs'),
  path.join(baseDir, 'connectors'),
  path.join(baseDir, 'knowledge'),
  path.join(baseDir, 'engines'),
  path.join(baseDir, 'agents'),
  path.join(baseDir, 'workflows'),
  path.join(__dirname, 'architecture'),
  path.join(__dirname, 'reports'),
  path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'architecture'),
  path.join(__dirname, 'src', 'app', 'organic-os', 'architecture')
];

// Clean old combined interfaces files
const oldFiles = [
  path.join(baseDir, 'connectors', 'interfaces.ts'),
  path.join(baseDir, 'knowledge', 'interfaces.ts'),
  path.join(baseDir, 'engines', 'interfaces.ts'),
  path.join(baseDir, 'agents', 'interfaces.ts'),
  path.join(baseDir, 'workflows', 'interfaces.ts'),
];

oldFiles.forEach(f => {
  if (fs.existsSync(f)) {
    fs.unlinkSync(f);
    console.log('Deleted old file:', f);
  }
});

dirsToCreate.forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {
  // --- TYPES ---
  [path.join(baseDir, 'types', 'index.ts')]: `export type CoreLayer = 'connectors' | 'knowledge' | 'engines' | 'agents' | 'workflows';
export type CoreStatus = 'idle' | 'running' | 'success' | 'fail' | 'error';

export interface CoreEvent {
  id: string;
  type: string;
  layer: CoreLayer;
  timestamp: string;
  payload: any;
}

export interface CoreError extends Error {
  code: string;
  layer: CoreLayer;
  recoverable: boolean;
}

export interface CoreLog {
  level: 'info' | 'warn' | 'error' | 'debug';
  layer: CoreLayer;
  message: string;
  meta?: any;
  timestamp: string;
}

export interface ExecutionContext {
  executionId: string;
  startedAt: string;
  params: any;
}

export interface ExecutionResult<T = any> {
  success: boolean;
  data?: T;
  error?: CoreError;
  durationMs: number;
}

export interface ConnectorDefinition { id: string; name: string; version: string; status: CoreStatus; }
export interface KnowledgeDefinition { id: string; name: string; version: string; }
export interface EngineDefinition { id: string; name: string; version: string; }
export interface AgentDefinition { id: string; name: string; version: string; }
export interface WorkflowDefinition { id: string; name: string; version: string; steps: string[]; }
`,

  // --- EVENTS, ERRORS, LOGS (Placeholders) ---
  [path.join(baseDir, 'events', 'event-bus.ts')]: `import { CoreEvent } from '../types';
export class EventBus {
  public publish(event: CoreEvent) { /* implementation */ }
}
`,
  [path.join(baseDir, 'errors', 'core-error.ts')]: `import { CoreError, CoreLayer } from '../types';
export class OrganicCoreError extends Error implements CoreError {
  constructor(public code: string, message: string, public layer: CoreLayer, public recoverable: boolean) {
    super(message);
    this.name = 'OrganicCoreError';
  }
}
`,
  [path.join(baseDir, 'logs', 'logger.ts')]: `import { CoreLog, CoreLayer } from '../types';
export class Logger {
  public log(level: CoreLog['level'], layer: CoreLayer, message: string, meta?: any) {
    const entry: CoreLog = { level, layer, message, meta, timestamp: new Date().toISOString() };
    console.log(\`[\${entry.timestamp}] [\${layer.toUpperCase()}] \${message}\`);
  }
}
`,

  // --- LAYER 1: CONNECTORS ---
  [path.join(baseDir, 'connectors', 'connector-context.ts')]: `import { ExecutionContext } from '../types';
export interface ConnectorContext extends ExecutionContext {}
`,
  [path.join(baseDir, 'connectors', 'connector-result.ts')]: `import { ExecutionResult } from '../types';
export interface ConnectorResult<T> extends ExecutionResult<T> {}
`,
  [path.join(baseDir, 'connectors', 'base-connector.ts')]: `import { ConnectorContext } from './connector-context';
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
`,
  [path.join(baseDir, 'connectors', 'connector-registry.ts')]: `import { BaseConnector } from './base-connector';
export class ConnectorRegistry {
  private items = new Map<string, BaseConnector>();
  register(connector: BaseConnector) { this.items.set(connector.id, connector); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
`,
  [path.join(baseDir, 'connectors', 'connector-factory.ts')]: `import { BaseConnector } from './base-connector';
export interface ConnectorFactory {
  create(type: string, config: any): BaseConnector;
}
`,
  [path.join(baseDir, 'connectors', 'connector-manager.ts')]: `import { ConnectorRegistry } from './connector-registry';
export class ConnectorManager {
  constructor(public registry: ConnectorRegistry) {}
}
`,

  // --- LAYER 2: KNOWLEDGE ---
  [path.join(baseDir, 'knowledge', 'knowledge-context.ts')]: `import { ExecutionContext } from '../types';
export interface KnowledgeContext extends ExecutionContext {}
`,
  [path.join(baseDir, 'knowledge', 'knowledge-provider.ts')]: `import { KnowledgeContext } from './knowledge-context';
export interface KnowledgeProvider {
  id: string;
  name: string;
  version: string;
  load(source: string): Promise<void>;
  validate(data: any): boolean;
  resolve(query: string, ctx: KnowledgeContext): Promise<any>;
}
`,
  [path.join(baseDir, 'knowledge', 'knowledge-registry.ts')]: `import { KnowledgeProvider } from './knowledge-provider';
export class KnowledgeRegistry {
  private items = new Map<string, KnowledgeProvider>();
  register(p: KnowledgeProvider) { this.items.set(p.id, p); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
`,
  [path.join(baseDir, 'knowledge', 'knowledge-loader.ts')]: `export interface KnowledgeLoader { load(path: string): Promise<any>; }`,
  [path.join(baseDir, 'knowledge', 'knowledge-cache.ts')]: `export interface KnowledgeCache { get(key: string): any; set(key: string, val: any): void; }`,
  [path.join(baseDir, 'knowledge', 'knowledge-index.ts')]: `export interface KnowledgeIndex { build(data: any[]): void; search(q: string): any[]; }`,
  [path.join(baseDir, 'knowledge', 'knowledge-resolver.ts')]: `import { KnowledgeContext } from './knowledge-context';
export interface KnowledgeResolver { resolveEntity(name: string, ctx: KnowledgeContext): any; }`,

  // --- LAYER 3: ENGINES ---
  [path.join(baseDir, 'engines', 'engine-context.ts')]: `import { ExecutionContext } from '../types';
export interface EngineContext extends ExecutionContext {}
`,
  [path.join(baseDir, 'engines', 'engine-result.ts')]: `import { ExecutionResult } from '../types';
export interface EngineResult<T> extends ExecutionResult<T> {}
`,
  [path.join(baseDir, 'engines', 'base-engine.ts')]: `import { EngineContext } from './engine-context';
import { EngineResult } from './engine-result';

export interface BaseEngine {
  id: string;
  name: string;
  version: string;
  analyze(data: any, ctx: EngineContext): Promise<EngineResult<any>>;
  score(data: any): number;
  recommend(analysis: any): any[];
}
`,
  [path.join(baseDir, 'engines', 'engine-registry.ts')]: `import { BaseEngine } from './base-engine';
export class EngineRegistry {
  private items = new Map<string, BaseEngine>();
  register(e: BaseEngine) { this.items.set(e.id, e); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
`,
  [path.join(baseDir, 'engines', 'engine-factory.ts')]: `import { BaseEngine } from './base-engine';
export interface EngineFactory { create(type: string): BaseEngine; }
`,
  [path.join(baseDir, 'engines', 'engine-manager.ts')]: `import { EngineRegistry } from './engine-registry';
export class EngineManager { constructor(public registry: EngineRegistry) {} }
`,

  // --- LAYER 4: AGENTS ---
  [path.join(baseDir, 'agents', 'agent-context.ts')]: `import { ExecutionContext } from '../types';
export interface AgentContext extends ExecutionContext {}
`,
  [path.join(baseDir, 'agents', 'agent-result.ts')]: `import { ExecutionResult } from '../types';
export interface AgentResult<T> extends ExecutionResult<T> {}
`,
  [path.join(baseDir, 'agents', 'base-agent.ts')]: `import { AgentContext } from './agent-context';
import { AgentResult } from './agent-result';

export interface BaseAgent {
  id: string;
  name: string;
  version: string;
  execute(task: any, ctx: AgentContext): Promise<AgentResult<any>>;
  validate(task: any): boolean;
  report(): any;
}
`,
  [path.join(baseDir, 'agents', 'agent-registry.ts')]: `import { BaseAgent } from './base-agent';
export class AgentRegistry {
  private items = new Map<string, BaseAgent>();
  register(a: BaseAgent) { this.items.set(a.id, a); }
  get(id: string) { return this.items.get(id); }
  getAll() { return Array.from(this.items.values()); }
}
`,
  [path.join(baseDir, 'agents', 'agent-factory.ts')]: `import { BaseAgent } from './base-agent';
export interface AgentFactory { create(role: string): BaseAgent; }
`,
  [path.join(baseDir, 'agents', 'agent-manager.ts')]: `import { AgentRegistry } from './agent-registry';
export class AgentManager { constructor(public registry: AgentRegistry) {} }
`,

  // --- LAYER 5: WORKFLOWS ---
  [path.join(baseDir, 'workflows', 'workflow-state.ts')]: `export interface WorkflowState { currentStep: number; status: string; data: any; }`,
  [path.join(baseDir, 'workflows', 'workflow-result.ts')]: `import { ExecutionResult } from '../types';
export interface WorkflowResult<T> extends ExecutionResult<T> {}
`,
  [path.join(baseDir, 'workflows', 'workflow-history.ts')]: `import { WorkflowState } from './workflow-state';
export interface WorkflowHistory { logState(s: WorkflowState): void; getTimeline(): WorkflowState[]; }
`,
  [path.join(baseDir, 'workflows', 'workflow-executor.ts')]: `export interface WorkflowExecutor { executeSteps(steps: string[]): Promise<void>; }`,
  [path.join(baseDir, 'workflows', 'workflow-registry.ts')]: `export class WorkflowRegistry {
  private items = new Map<string, any>();
  register(w: any) { this.items.set(w.id, w); }
  getAll() { return Array.from(this.items.values()); }
}
`,
  [path.join(baseDir, 'workflows', 'workflow-manager.ts')]: `import { WorkflowRegistry } from './workflow-registry';
export interface BaseWorkflow {
  id: string;
  name: string;
  version: string;
  steps: string[];
  execute(): Promise<any>;
  pause(): void;
  resume(): void;
  cancel(): void;
}
export class WorkflowManager { constructor(public registry: WorkflowRegistry) {} }
`,

  // --- API ROUTE ---
  [path.join(__dirname, 'src', 'app', 'api', 'organic-os', 'architecture', 'route.ts')]: `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    architecture_version: "3.0.0",
    layers: ["Connectors", "Knowledge", "Engines", "Agents", "Workflows"],
    status: {
      connectors: "Ready",
      knowledge: "Ready",
      engines: "Ready",
      agents: "Ready",
      workflows: "Ready"
    },
    quantities: {
      connectors: 0,
      knowledge: 0,
      engines: 0,
      agents: 0,
      workflows: 0
    },
    health_score: 100,
    documentation: [
      "/architecture/layers.md",
      "/architecture/connectors.md",
      "/architecture/knowledge.md",
      "/architecture/engines.md",
      "/architecture/agents.md",
      "/architecture/workflows.md",
      "/architecture/epic-03-architecture.md"
    ],
    last_update: new Date().toISOString()
  });
}
`,

  // --- PAGE ---
  [path.join(__dirname, 'src', 'app', 'organic-os', 'architecture', 'page.tsx')]: `"use client";
import React, { useEffect, useState } from 'react';

export default function ArchitecturePanel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/organic-os/architecture')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-10 text-white">Loading Architecture Telemetry...</div>;

  const layerCards = [
    { id: "L5", name: "Workflows", key: "workflows", icon: "⚙️", color: "from-fuchsia-500 to-purple-600" },
    { id: "L4", name: "Agents", key: "agents", icon: "🧠", color: "from-blue-500 to-indigo-600" },
    { id: "L3", name: "Engines", key: "engines", icon: "⚡", color: "from-emerald-400 to-teal-500" },
    { id: "L2", name: "Knowledge", key: "knowledge", icon: "📚", color: "from-amber-400 to-orange-500" },
    { id: "L1", name: "Connectors", key: "connectors", icon: "🔌", color: "from-rose-400 to-red-500" },
  ];

  return (
    <div className="p-10 font-sans max-w-7xl mx-auto min-h-screen text-slate-200">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="text-indigo-400">🏛️</span> Core Architecture
          </h1>
          <p className="text-[#8b949e] mt-2 font-medium tracking-wide">Epic 03 - 5-Layer Autonomous Backbone (Sprint 26.1)</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#161b22] border border-[#30363d] px-6 py-2.5 rounded-xl shadow-lg font-mono text-sm flex flex-col items-center">
            <span className="text-[#8b949e] text-[10px] uppercase">Version</span>
            <span className="text-indigo-400 font-bold">{data.architecture_version}</span>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] px-6 py-2.5 rounded-xl shadow-lg font-mono text-sm flex flex-col items-center">
            <span className="text-[#8b949e] text-[10px] uppercase">Health</span>
            <span className="text-emerald-400 font-bold">{data.health_score}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mb-6">The 5 Layers Stack</h2>
          {layerCards.map((layer) => (
            <div key={layer.id} className="relative bg-[#161b22] rounded-2xl border border-[#30363d] p-5 shadow-xl flex items-center gap-6 overflow-hidden group hover:border-[#58a6ff]/50 transition-all">
               <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${layer.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20\`}></div>
               <div className="w-16 h-16 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-2xl shadow-inner relative z-10">{layer.icon}</div>
               <div className="flex-1 relative z-10">
                 <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e]">{layer.id}</span>
                   <h3 className="text-xl font-bold text-slate-100">{layer.name}</h3>
                 </div>
               </div>
               <div className="flex flex-col items-end gap-2 relative z-10">
                 <div className="flex items-center gap-2">
                   <span className="text-3xl font-black text-slate-300">{data.quantities[layer.key]}</span>
                   <span className="text-[10px] font-bold text-[#8b949e] uppercase">Registries</span>
                 </div>
                 <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{data.status[layer.key]}</span>
               </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-8 shadow-2xl relative">
             <h2 className="text-lg font-bold text-slate-100 mb-6">Contratos Obrigatórios (Sprint 26.1)</h2>
             <div className="space-y-4">
                {[
                  { l: "Connectors", m: "connect(), validate(), execute(), normalize()" },
                  { l: "Knowledge", m: "load(), validate(), resolve()" },
                  { l: "Engines", m: "analyze(), score(), recommend()" },
                  { l: "Agents", m: "execute(), validate(), report()" },
                  { l: "Workflows", m: "execute(), pause(), resume(), cancel()" },
                ].map((c, i) => (
                  <div key={i} className="bg-[#0d1117] border border-[#21262d] p-4 rounded-lg">
                    <span className="text-indigo-400 font-bold text-xs uppercase block mb-1">{c.l}</span>
                    <span className="text-sm text-slate-400 font-mono">{c.m}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">Last Update: {data.last_update}</div>
        </div>
      </div>
    </div>
  );
}
`,

  // --- DOCS & REPORTS ---
  [path.join(__dirname, 'architecture', 'epic-03-architecture.md')]: `# Epic 03 Architecture
A Sprint 26.1 estipula 5 camadas fundamentais onde NADA externo é conectado agora. Serve como a planta-baixa do edifício de Agentes Autônomos.`,
  
  [path.join(__dirname, 'reports', 'sprint-26-1-summary.md')]: `# Sprint 26.1 Summary

## O que foi criado
- A estrutura rígida do \`organic-traffic-os/core/\`.
- 30+ arquivos tipados em TypeScript definindo os contratos (Interfaces) exatos exigidos pelo Blueprint.
- API Route \`/api/organic-os/architecture\`.
- Premium UI em React conectada à API.

## O que NÃO foi implementado
- Zero lógicas de IA.
- Zero integrações reais (Nenhum GSC, Bing ou Analytics).
- Nenhuma geração ou publicação de conteúdo.

## Próximos Passos
Preencher a Layer 1 (Connectors) com implementações autênticas que obedeçam ao contrato estrito estabelecido agora.
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Created: ' + filepath);
}
