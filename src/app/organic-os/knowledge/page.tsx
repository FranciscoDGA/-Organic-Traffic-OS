'use client';

import { useState, useEffect } from 'react';

interface KnowledgeItem { id: string; name: string; category: string; subcategory: string; workspaceId?: string; version: string; status: string; tags: string[]; content: string; }

export default function KnowledgeDashboard() {
  const [playbooks, setPlaybooks] = useState<KnowledgeItem[]>([]);
  const [prompts, setPrompts] = useState<KnowledgeItem[]>([]);
  const [templates, setTemplates] = useState<KnowledgeItem[]>([]);
  const [guidelines, setGuidelines] = useState<KnowledgeItem[]>([]);
  const [workspaceK, setWorkspaceK] = useState<KnowledgeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'playbooks' | 'prompts' | 'templates' | 'guidelines' | 'workspace'>('playbooks');
  const [selected, setSelected] = useState<KnowledgeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KnowledgeItem[] | null>(null);

  useEffect(() => {
    fetch('/api/organic-os/knowledge/playbooks').then(r => r.json()).then(setPlaybooks);
    fetch('/api/organic-os/knowledge/prompts').then(r => r.json()).then(setPrompts);
    fetch('/api/organic-os/knowledge/templates').then(r => r.json()).then(setTemplates);
    fetch('/api/organic-os/knowledge/guidelines').then(r => r.json()).then(setGuidelines);
    fetch('/api/organic-os/knowledge?workspace=passacumaru').then(r => r.json()).then(setWorkspaceK);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) { setSearchResults(null); return; }
    const res = await fetch('/api/organic-os/knowledge/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: searchQuery }) });
    setSearchResults(await res.json());
  };

  const items = searchResults || (() => {
    switch (activeTab) {
      case 'playbooks': return playbooks;
      case 'prompts': return prompts;
      case 'templates': return templates;
      case 'guidelines': return guidelines;
      case 'workspace': return workspaceK;
      default: return [];
    }
  })();

  const catColor = (c: string) => {
    const m: Record<string, string> = { playbook: '#22c55e', prompt: '#3b82f6', template: '#8b5cf6', guideline: '#f59e0b', workspace_knowledge: '#06b6d4' };
    return m[c] || '#6b7280';
  };

  return (
    <div style={{ padding: '2rem', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Knowledge Base</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>Playbooks, Templates, Prompts e Diretrizes</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Buscar conhecimento..." style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#e2e8f0', fontSize: '0.875rem' }} />
        <button onClick={handleSearch} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer' }}>Buscar</button>
        {searchResults && <button onClick={() => { setSearchResults(null); setSearchQuery(''); }} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #475569', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>Limpar</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {([['playbooks', playbooks.length], ['prompts', prompts.length], ['templates', templates.length], ['guidelines', guidelines.length], ['workspace', workspaceK.length]] as const).map(([tab, count]) => (
          <button key={tab} onClick={() => { setActiveTab(tab as any); setSearchResults(null); }} style={{ padding: '0.5rem', borderRadius: '6px', border: activeTab === tab ? '1px solid #3b82f6' : '1px solid #334155', background: activeTab === tab ? '#1e3a5f' : '#1e293b', color: activeTab === tab ? '#60a5fa' : '#94a3b8', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'center' }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {items.map(item => (
            <div key={item.id} onClick={() => setSelected(item)} style={{ background: '#1e293b', border: selected?.id === item.id ? '1px solid #3b82f6' : '1px solid #334155', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.875rem' }}>{item.name}</span>
                <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '9999px', background: catColor(item.category) + '22', color: catColor(item.category) }}>{item.category}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>v{item.version} | {item.subcategory}</div>
              <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                {item.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px', background: '#334155', color: '#cbd5e1' }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', position: 'sticky', top: '1rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {selected ? (
            <>
              <h3 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>{selected.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '9999px', background: catColor(selected.category) + '22', color: catColor(selected.category) }}>{selected.category}</span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>v{selected.version}</span>
                {selected.workspaceId && <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{selected.workspaceId}</span>}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.75rem', lineHeight: 1.5 }}>{selected.content}</p>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {selected.tags.map(t => <span key={t} style={{ fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px', background: '#334155', color: '#cbd5e1' }}>{t}</span>)}
              </div>
            </>
          ) : (
            <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Selecione um item</p>
          )}
        </div>
      </div>
    </div>
  );
}
