"use client";
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
               <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${layer.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20`}></div>
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
