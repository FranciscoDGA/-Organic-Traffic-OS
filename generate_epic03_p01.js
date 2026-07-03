const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'organic-traffic-os', 'core');
const connectorsDir = path.join(baseDir, 'connectors');
const knowledgeDir = path.join(baseDir, 'knowledge');
const enginesDir = path.join(baseDir, 'engines');
const agentsDir = path.join(baseDir, 'agents');
const workflowsDir = path.join(baseDir, 'workflows');

const archDocsDir = path.join(__dirname, 'architecture');
const pageDir = path.join(__dirname, 'src', 'app', 'organic-os', 'architecture');

const dirs = [
  connectorsDir, knowledgeDir, enginesDir, agentsDir, workflowsDir,
  archDocsDir, pageDir
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

const files = {
  // --- UI Update ---
  [path.join(__dirname, 'src', 'app', 'organic-os', 'layout.tsx')]: `import Link from 'next/link';

export default function OrganicOSLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { label: 'Inventory Engine', path: '/organic-os/inventory', icon: '📦' },
    { label: 'Competitors Intel', path: '/organic-os/competitors', icon: '⚔️' },
    { label: 'Keyword Intel', path: '/organic-os/keywords', icon: '🔑' },
    { label: 'Search Intelligence', path: '/organic-os/search', icon: '📡' },
    { label: 'Research Collectors', path: '/organic-os/collectors', icon: '🕸️' },
    { label: 'Opportunity Discovery', path: '/organic-os/opportunities', icon: '💡' },
    { label: 'Editorial Planning', path: '/organic-os/editorial', icon: '📅' },
    { label: 'Brief Intelligence', path: '/organic-os/briefs', icon: '📝' },
    { label: 'Blueprints', path: '/organic-os/blueprints', icon: '🏗️' },
    { label: 'Research Packs', path: '/organic-os/research', icon: '🔬' },
    { label: 'Facts & Sources', path: '/organic-os/facts', icon: '📚' },
    { label: 'Strategy Engine', path: '/organic-os/strategy', icon: '🎯' },
    { label: 'Draft Writer', path: '/organic-os/drafts', icon: '✍️' },
    { label: 'Quality Review', path: '/organic-os/quality', icon: '⚖️' },
    { label: 'Audience Adaptation', path: '/organic-os/audience', icon: '🎭' },
    { label: 'Natural Language', path: '/organic-os/natural-language', icon: '✨' },
    { label: 'Visibility Engine', path: '/organic-os/visibility', icon: '👁️' },
    { label: 'Asset Library', path: '/organic-os/assets', icon: '💎' },
    { label: 'Publishing Engine', path: '/organic-os/publishing', icon: '🚀' },
    { label: 'Performance Engine', path: '/organic-os/performance', icon: '📈' },
    { label: 'E2E Validation', path: '/organic-os/e2e', icon: '🧪' },
    { label: 'Core Architecture', path: '/organic-os/architecture', icon: '🏛️' },
    { label: 'System Health', path: '/organic-os/health', icon: '🛡️' }
  ];

  return (
    <div className="flex h-screen bg-[#0f1115] font-sans selection:bg-indigo-500 selection:text-white">
      {/* Modern Premium Sidebar - Dark Mode HSL */}
      <aside className="w-72 bg-[#161921] border-r border-[#1f222d] flex flex-col shadow-sm relative z-10">
        <div className="p-6 border-b border-[#1f222d] bg-gradient-to-br from-[#1c1f2a] to-[#161921]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 shadow-md shadow-indigo-500/20 flex items-center justify-center text-white font-bold text-lg">
              OS
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-tight">Organic Traffic OS</h1>
              <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold mt-0.5">Epic 03 Active</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Engines & Modules</div>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200"
                >
                  <span className="text-base grayscale group-hover:grayscale-0 transition-all duration-200 opacity-60 group-hover:opacity-100 transform group-hover:scale-110">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-[#1f222d] bg-[#12141a]">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>v3.0.0</span>
            <span className="px-2 py-1 rounded-md bg-[#1f222d] border border-[#2a2e3d] text-slate-300 shadow-sm">Epic 03</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0f1115] relative">
        {/* Subtle noise/grid pattern for premium feel */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
        {children}
      </main>
    </div>
  );
}
`,
  // --- CONNECTORS ---
  [path.join(connectorsDir, 'interfaces.ts')]: `export interface ConnectorContext { requestId: string; timestamp: number; }
export interface ConnectorResult<T> { success: boolean; data?: T; error?: string; }
export interface BaseConnector {
  id: string;
  name: string;
  connect(ctx: ConnectorContext): Promise<ConnectorResult<void>>;
  disconnect(ctx: ConnectorContext): Promise<ConnectorResult<void>>;
}
export interface ConnectorRegistry {
  register(connector: BaseConnector): void;
  get(id: string): BaseConnector | undefined;
}
export interface ConnectorFactory {
  create(type: string, config: any): BaseConnector;
}
export interface ConnectorManager {
  registry: ConnectorRegistry;
  factory: ConnectorFactory;
  execute(id: string, action: string, payload: any): Promise<ConnectorResult<any>>;
}
`,
  // --- KNOWLEDGE ---
  [path.join(knowledgeDir, 'interfaces.ts')]: `export interface KnowledgeContext { scope: string; locale: string; }
export interface KnowledgeProvider {
  id: string;
  fetch(query: string, ctx: KnowledgeContext): Promise<any>;
}
export interface KnowledgeRegistry { register(provider: KnowledgeProvider): void; }
export interface KnowledgeLoader { load(source: string): Promise<void>; }
export interface KnowledgeCache { get(key: string): any; set(key: string, val: any): void; }
export interface KnowledgeIndex { build(data: any): void; search(query: string): any; }
export interface KnowledgeResolver { resolve(intent: string, ctx: KnowledgeContext): Promise<any>; }
`,
  // --- ENGINES ---
  [path.join(enginesDir, 'interfaces.ts')]: `export interface EngineContext { executionId: string; priority: number; }
export interface EngineResult<T> { status: 'success'|'fail'; payload?: T; trace: string[]; }
export interface BaseEngine {
  id: string;
  run(payload: any, ctx: EngineContext): Promise<EngineResult<any>>;
}
export interface EngineRegistry { register(engine: BaseEngine): void; }
export interface EngineFactory { create(type: string): BaseEngine; }
export interface EngineManager {
  registry: EngineRegistry;
  dispatch(engineId: string, payload: any): Promise<EngineResult<any>>;
}
`,
  // --- AGENTS ---
  [path.join(agentsDir, 'interfaces.ts')]: `export interface AgentContext { sessionId: string; permissions: string[]; }
export interface AgentResult { action: string; confidence: number; metadata: any; }
export interface BaseAgent {
  id: string;
  role: string;
  decide(state: any, ctx: AgentContext): Promise<AgentResult>;
}
export interface AgentRegistry { register(agent: BaseAgent): void; }
export interface AgentFactory { create(role: string): BaseAgent; }
export interface AgentManager {
  registry: AgentRegistry;
  delegate(agentId: string, task: any): Promise<AgentResult>;
}
`,
  // --- WORKFLOWS ---
  [path.join(workflowsDir, 'interfaces.ts')]: `export interface WorkflowState { currentStep: string; data: any; }
export interface WorkflowResult { completed: boolean; finalState: WorkflowState; }
export interface WorkflowHistory { log(event: string, state: WorkflowState): void; }
export interface WorkflowExecutor { execute(workflowId: string, initialData: any): Promise<WorkflowResult>; }
export interface WorkflowRegistry { register(workflowId: string, steps: string[]): void; }
export interface WorkflowManager {
  registry: WorkflowRegistry;
  executor: WorkflowExecutor;
  history: WorkflowHistory;
}
`,
  // --- DOCS ---
  [path.join(archDocsDir, 'layers.md')]: `# Architecture Layers

A infraestrutura do Epic 03 é construída sobre 5 camadas estritas:

\`\`\`mermaid
graph TD
    A[Layer 5: Workflows] --> B[Layer 4: Agents]
    B --> C[Layer 3: Engines]
    C --> D[Layer 2: Knowledge]
    D --> E[Layer 1: Connectors]
\`\`\`

Regra de Ouro: Uma camada superior pode invocar uma inferior, mas NUNCA o contrário. Agentes (L4) orquestram Engines (L3), que consomem Knowledge (L2), que é alimentado por Connectors (L1).
`,
  [path.join(archDocsDir, 'connectors.md')]: `# Layer 1: Connectors
Os conectores lidam puramente com I/O externo. Sem lógica de negócio.`,
  [path.join(archDocsDir, 'knowledge.md')]: `# Layer 2: Knowledge
Sistemas de indexação, cache e resolução de informações estáticas e dinâmicas.`,
  [path.join(archDocsDir, 'engines.md')]: `# Layer 3: Engines
Máquinas de estado determinísticas. Recebem Input A e geram Output B.`,
  [path.join(archDocsDir, 'agents.md')]: `# Layer 4: Agents
Entidades autônomas não-determinísticas. Tomam decisões baseadas em um contexto para invocar Engines.`,
  [path.join(archDocsDir, 'workflows.md')]: `# Layer 5: Workflows
Orquestradores de alto nível que sequenciam ações de múltiplos Agentes.`,

  // --- PREMIUM DASHBOARD ---
  [path.join(pageDir, 'page.tsx')]: `import React from 'react';

export default function ArchitecturePanel() {
  const layers = [
    { id: "L5", name: "Workflows", desc: "State Machines & Orchestration", count: 0, status: "Ready", icon: "⚙️", color: "from-fuchsia-500 to-purple-600", delay: "delay-[0ms]" },
    { id: "L4", name: "Agents", desc: "Autonomous Entities", count: 0, status: "Ready", icon: "🧠", color: "from-blue-500 to-indigo-600", delay: "delay-[100ms]" },
    { id: "L3", name: "Engines", desc: "Deterministic Logic", count: 23, status: "Active", icon: "⚡", color: "from-emerald-400 to-teal-500", delay: "delay-[200ms]" },
    { id: "L2", name: "Knowledge", desc: "Context & Vector Memory", count: 0, status: "Ready", icon: "📚", color: "from-amber-400 to-orange-500", delay: "delay-[300ms]" },
    { id: "L1", name: "Connectors", desc: "External I/O", count: 2, status: "Active", icon: "🔌", color: "from-rose-400 to-red-500", delay: "delay-[400ms]" },
  ];

  return (
    <div className="p-10 font-sans max-w-7xl mx-auto min-h-screen text-slate-200">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
            <span className="text-indigo-400">🏛️</span> Core Architecture
          </h1>
          <p className="text-[#8b949e] mt-2 font-medium tracking-wide">Epic 03 - 5-Layer Autonomous Backbone</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#161b22] border border-[#30363d] px-6 py-2.5 rounded-xl shadow-lg font-mono text-sm flex flex-col items-center">
            <span className="text-[#8b949e] text-[10px] uppercase">Version</span>
            <span className="text-indigo-400 font-bold">v3.0.0</span>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] px-6 py-2.5 rounded-xl shadow-lg font-mono text-sm flex flex-col items-center">
            <span className="text-[#8b949e] text-[10px] uppercase">Health</span>
            <span className="text-emerald-400 font-bold">100%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Architecture Stack */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-[#8b949e] uppercase tracking-widest mb-6">The 5 Layers Stack</h2>
          
          {layers.map((layer) => (
            <div key={layer.id} className={\`relative bg-[#161b22] rounded-2xl border border-[#30363d] p-5 shadow-xl flex items-center gap-6 overflow-hidden group hover:border-[#58a6ff]/50 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up \${layer.delay}\`}>
               {/* Glassmorphism gradient glow */}
               <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${layer.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity\`}></div>
               
               <div className="w-16 h-16 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-2xl shadow-inner relative z-10">
                  {layer.icon}
               </div>
               
               <div className="flex-1 relative z-10">
                 <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e]">{layer.id}</span>
                   <h3 className="text-xl font-bold text-slate-100">{layer.name}</h3>
                 </div>
                 <p className="text-sm text-[#8b949e]">{layer.desc}</p>
               </div>

               <div className="flex flex-col items-end gap-2 relative z-10">
                 <div className="flex items-center gap-2">
                   <span className="text-3xl font-black text-slate-300">{layer.count}</span>
                   <span className="text-[10px] font-bold text-[#8b949e] uppercase">Registries</span>
                 </div>
                 <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase \${layer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}\`}>
                   {layer.status}
                 </span>
               </div>
            </div>
          ))}
        </div>

        {/* Global Interfaces & Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] rounded-2xl border border-[#30363d] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-indigo-500/5">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
             </div>
             
             <h2 className="text-lg font-bold text-slate-100 mb-6 relative z-10">Global Infrastructure Types</h2>
             
             <div className="space-y-3 relative z-10">
                {['Logger (Pino/Winston mapping)', 'ErrorBoundary (RFC 7807)', 'EventBus (Pub/Sub)', 'ContextPayload (Universal state)'].map((type, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#0d1117] border border-[#21262d] p-3 rounded-lg">
                    <span className="text-indigo-400">❖</span>
                    <span className="text-sm text-slate-300 font-mono">{type}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-6 flex gap-4 items-start shadow-lg">
             <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 flex-shrink-0">
               ⚠️
             </div>
             <div>
               <h3 className="text-sm font-bold text-slate-200 mb-1">Strict Isolation Rule</h3>
               <p className="text-xs text-[#8b949e] leading-relaxed">
                 A Layer 4 (Agents) nunca pode invocar diretamente a Layer 2 (Knowledge). Ela deve solicitar à Layer 3 (Engines) que utilize o Knowledge Context. Essa regra evita acoplamento cíclico.
               </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Created: ' + filepath);
}
