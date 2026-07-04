"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const menuSections = [
  {
    label: "Workspaces",
    subtitle: "Gestão & Configuração",
    items: [
      { label: 'Setup Inicial',            path: '/organic-os/setup',                icon: '🧙‍♂️' },
      { label: 'Meus Workspaces',          path: '/organic-os/workspaces',           icon: '🏢' },
      { label: 'Configuração de Site',     path: '/organic-os/site-configuration',   icon: '⚙️' },
      { label: 'Ajustes Globais',          path: '/organic-os/settings',             icon: '🛠️' },
    ]
  },
  {
    label: "Intelligence",
    subtitle: "Dados & Auditoria",
    items: [
      { label: 'Inventário SEO',           path: '/organic-os/inventory',            icon: '📦' },
      { label: 'Keyword Research',         path: '/organic-os/keywords',             icon: '🔑' },
      { label: 'Análise Concorrência',     path: '/organic-os/competitor-analysis',  icon: '⚔️' },
      { label: 'Auditoria On-Page',        path: '/organic-os/seo-auditor',          icon: '🔍' },
      { label: 'Analytics e Tráfego',      path: '/organic-os/analytics',            icon: '📈' },
    ]
  },
  {
    label: "Planning",
    subtitle: "Estratégia & Pautas",
    items: [
      { label: 'Topic Clusters',           path: '/organic-os/topic-cluster',        icon: '🕸️' },
      { label: 'Content Planner',          path: '/organic-os/content-planner',      icon: '📅' },
      { label: 'Linkagem Interna',         path: '/organic-os/internal-linking',     icon: '🔗' },
    ]
  },
  {
    label: "Production",
    subtitle: "Criação & Publicação",
    items: [
      { label: 'AI Writer',                path: '/organic-os/ai-writer',            icon: '✍️' },
      { label: 'Universal Publisher',      path: '/organic-os/publisher',            icon: '🚀' },
    ]
  }
];

function NavItem({ item }: { item: { label: string; path: string; icon: string } }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        href={item.path}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '7px 10px', borderRadius: '8px',
          fontSize: '13px', fontWeight: '500',
          color: hovered ? '#a5b4fc' : '#6b7a99',
          backgroundColor: hovered ? 'rgba(99,102,241,0.1)' : 'transparent',
          textDecoration: 'none', transition: 'all 0.15s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={{ fontSize: '14px', opacity: hovered ? 1 : 0.6, transition: 'opacity 0.15s' }}>{item.icon}</span>
        {item.label}
      </Link>
    </li>
  );
}

function CollapsibleSection({ section, isDefaultOpen }: { section: typeof menuSections[0]; isDefaultOpen?: boolean }) {
  const [open, setOpen] = useState(isDefaultOpen ?? false);
  const Chevron = () => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{
      transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease',
    }}>
      <path d="M3 1L7 5L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', border: 'none', background: 'transparent',
          padding: '8px 10px', cursor: 'pointer', borderRadius: '8px',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <span style={{ color: open ? '#818cf8' : '#2e3550', transition: 'color 0.15s', display: 'flex' }}>
          <Chevron />
        </span>
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{
            fontSize: '10px', fontWeight: '700', color: open ? '#c7d2fe' : '#4b5580',
            textTransform: 'uppercase', letterSpacing: '1px', lineHeight: '1.2',
            transition: 'color 0.15s',
          }}>
            {section.label}
          </div>
          {section.subtitle && (
            <div style={{
              fontSize: '9px', color: '#3d4461', fontWeight: '500',
              letterSpacing: '0.3px', marginTop: '1px',
            }}>
              {section.subtitle}
            </div>
          )}
        </div>
      </button>
      <div style={{
        maxHeight: open ? '400px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.25s ease',
        opacity: open ? 1 : 0,
      }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: '2px 0 4px 18px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {section.items.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function OrganicOSLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0b0e14', fontFamily: 'Inter, system-ui, sans-serif', overflow: 'hidden' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: '256px', minWidth: '256px',
        backgroundColor: '#0e1119',
        borderRight: '1px solid #1d2133',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid #1d2133', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '900', color: '#fff',
              boxShadow: '0 4px 12px rgba(99,102,241,0.35)', flexShrink: 0
            }}>OS</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '-0.2px' }}>
                Organic Traffic OS
              </div>
              <div style={{ fontSize: '9px', color: '#6366f1', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '1px' }}>
                Epic 04 Active
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {menuSections.map((section, idx) => (
            <CollapsibleSection
              key={section.label}
              section={section}
              isDefaultOpen={idx < 2}
            />
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '10px 18px', borderTop: '1px solid #1d2133', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span style={{ fontSize: '11px', color: '#2e3550', fontFamily: 'monospace' }}>v3.0.0</span>
          <span style={{
            fontSize: '10px', color: '#6366f1', fontWeight: '700',
            background: 'rgba(99,102,241,0.08)', padding: '2px 8px',
            borderRadius: '4px', border: '1px solid rgba(99,102,241,0.15)'
          }}>EPIC 04</span>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#0b0e14', position: 'relative' }}>
        {children}
      </main>
    </div>
  );
}
