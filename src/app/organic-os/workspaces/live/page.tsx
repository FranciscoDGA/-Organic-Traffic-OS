'use client';
import React from 'react';
export default function MultiWorkspaceLiveDashboard() {
  return (
    <div className="p-8 bg-[#0B0F19] min-h-screen text-slate-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Multi-Workspace Live</h1>
        <p className="text-slate-400 mb-8">Sprint 79: Escala 4x sem vazamento de dados ou contexto</p>
        <div className="grid grid-cols-2 gap-4">
          {['PassaCumaru', 'Qual o Seguro?', 'Tabuômetro', 'UtilPro Brasil'].map(w => (
            <div key={w} className="bg-slate-800/50 p-4 rounded border border-slate-700 flex justify-between">
              <span className="font-bold">{w}</span>
              <span className="text-emerald-400 uppercase text-xs font-bold px-2 py-1 bg-emerald-500/10 rounded">Live</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
