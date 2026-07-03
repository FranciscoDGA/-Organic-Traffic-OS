"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const menuSections = [
  {
    label: "Intelligence",
    subtitle: "Dados & Mercado",
    items: [
      { label: 'Inventory Engine',     path: '/organic-os/inventory',         icon: '📦' },
      { label: 'Competitors Intel',    path: '/organic-os/competitors',        icon: '⚔️' },
      { label: 'Keyword Intel',        path: '/organic-os/keywords',           icon: '🔑' },
      { label: 'Search Intelligence',  path: '/organic-os/search',             icon: '📡' },
      { label: 'Research Collectors',  path: '/organic-os/collectors',         icon: '🕸️' },
      { label: 'Opportunity Discovery',path: '/organic-os/opportunities',      icon: '💡' },
    ]
  },
  {
    label: "Planning",
    subtitle: "Estratégia & Escrita",
    items: [
      { label: 'Editorial Planning',   path: '/organic-os/editorial',          icon: '📅' },
      { label: 'Brief Intelligence',   path: '/organic-os/briefs',             icon: '📝' },
      { label: 'Blueprints',           path: '/organic-os/blueprints',         icon: '🏗️' },
      { label: 'Research Packs',       path: '/organic-os/research',           icon: '🔬' },
      { label: 'Facts & Sources',      path: '/organic-os/facts',              icon: '📚' },
    ]
  },
  {
    label: "Production",
    subtitle: "Criação & Qualidade",
    items: [
      { label: 'Strategy Engine',      path: '/organic-os/strategy',           icon: '🎯' },
      { label: 'Draft Writer',         path: '/organic-os/drafts',             icon: '✍️' },
      { label: 'Quality Review',       path: '/organic-os/quality',            icon: '⚖️' },
      { label: 'Audience Adaptation',  path: '/organic-os/audience',           icon: '🎭' },
      { label: 'Natural Language',     path: '/organic-os/natural-language',   icon: '✨' },
      { label: 'Visibility Engine',    path: '/organic-os/visibility',         icon: '👁️' },
      { label: 'Asset Library',        path: '/organic-os/assets',             icon: '💎' },
    ]
  },
  {
    label: "Operations",
    subtitle: "Publicação & Métricas",
    items: [
      { label: 'Publishing Engine',    path: '/organic-os/publishing',         icon: '🚀' },
      { label: 'Performance Engine',   path: '/organic-os/performance',        icon: '📈' },
      { label: 'E2E Validation',       path: '/organic-os/e2e',                icon: '🧪' },
      { label: 'Workflows',            path: '/organic-os/workflows',          icon: '🔄' },
    ]
  },
  {
    label: "Agents",
    subtitle: "Automação (Epic 03)",
    items: [
      { label: 'Discovery',            path: '/organic-os/agents/discovery',   icon: '🤖' },
      { label: 'Planning',             path: '/organic-os/agents/planning',    icon: '📋' },
      { label: 'Research',             path: '/organic-os/agents/research',    icon: '🔬' },
      { label: 'Fact',                 path: '/organic-os/agents/fact',        icon: '⚖️' },
      { label: 'Writer',              path: '/organic-os/agents/writer',      icon: '✍️' },
      { label: 'Review',              path: '/organic-os/agents/review',      icon: '🔍' },
      { label: 'Visibility',          path: '/organic-os/agents/visibility',  icon: '👁️' },
      { label: 'Publishing',          path: '/organic-os/agents/publishing',  icon: '🚀' },
      { label: 'Monitoring',          path: '/organic-os/agents/monitoring',  icon: '📈' },
    ]
  },
  {
    label: "Workspaces",
    subtitle: "Configuracao",
    items: [
      { label: 'Multi-Blog',              path: '/organic-os/workspaces-new',                 icon: '🌐' },
      { label: 'Knowledge Isolation',     path: '/organic-os/workspace-knowledge',            icon: '🔒' },
      { label: 'Onboarding',              path: '/organic-os/workspaces',                     icon: '🏢' },
      { label: 'Editorial Profile',       path: '/organic-os/workspace-editorial',            icon: '✍️' },
      { label: 'AI Intelligence',         path: '/organic-os/ai',                             icon: '🧠' },
      { label: 'Knowledge Base',          path: '/organic-os/knowledge',                      icon: '📚' },
      { label: 'Executive Dashboard',     path: '/organic-os/executive',                      icon: '📊' },
      { label: 'Daily Operations',        path: '/organic-os/daily-operations',               icon: '📅' },
    ]
  },
  {
    label: "System",
    subtitle: "Infraestrutura",
    items: [
      { label: 'Architecture',            path: '/organic-os/architecture',                   icon: '🏗️' },
      { label: 'Health',                  path: '/organic-os/health',                         icon: '💚' },
      { label: 'Staging & Sandbox',       path: '/organic-os/staging',                        icon: '🔬' },
      { label: 'Database & Storage',      path: '/organic-os/system/database',                icon: '🗄️' },
      { label: 'E2E Validation',          path: '/organic-os/validation',                     icon: '✅' },
      { label: 'Autonomous Ops',          path: '/organic-os/autonomous',                     icon: '🤖' },
      { label: 'Go-Live',                path: '/organic-os/go-live',                        icon: '🚀' },
      { label: 'Operations Center',      path: '/organic-os/operations',                     icon: '📡' },
      { label: 'Reliability',            path: '/organic-os/reliability',                    icon: '🛡️' },
      { label: 'Certification',          path: '/organic-os/certification',                  icon: '📋' },
    ]
  },
  {
    label: "Integrations",
    subtitle: "Visão Consolidada",
    items: [
      { label: 'Visão Geral',           path: '/organic-os/integrations',                      icon: '🔌' },
    ]
  },
  {
    label: "Orchestration",
    subtitle: "Coordenacao (Epic 06)",
    items: [
      { label: 'Orchestrator',          path: '/organic-os/orchestrator',                     icon: '⚙️' },
      { label: 'Mission Planner',       path: '/organic-os/mission-planner',                  icon: '📋' },
      { label: 'Workflow Orchestrator', path: '/organic-os/workflow',                         icon: '🔄' },
      { label: 'Runtime Engine (ORE)',  path: '/organic-os/runtime',                          icon: '⚡' },
      { label: 'Scheduler & Jobs',      path: '/organic-os/scheduler',                        icon: '📅' },
      { label: 'Event Bus',             path: '/organic-os/events',                           icon: '📡' },
      { label: 'Knowledge Graph',       path: '/organic-os/knowledge-graph',                  icon: '🔗' },
      { label: 'Memory Engine',         path: '/organic-os/memory',                          icon: '🧠' },
    ]
  },
  {
    label: "Engines",
    subtitle: "Inteligência (Epic 05)",
    items: [
      { label: 'Content Intelligence',     path: '/organic-os/engines/content-intelligence',      icon: '🧠' },
      { label: 'Semantic Intelligence',     path: '/organic-os/engines/semantic-intelligence',    icon: '🔮' },
      { label: 'Authority Intelligence',    path: '/organic-os/engines/authority-intelligence',   icon: '👑' },
      { label: 'Opportunity Intelligence',  path: '/organic-os/engines/opportunity-intelligence', icon: '💎' },
      { label: 'Predictive Intelligence',   path: '/organic-os/engines/predictive-intelligence',  icon: '📈' },
    ]
  },
  {
    label: "Connectors",
    subtitle: "Dados Reais (Epic 04)",
    items: [
      { label: 'Connector Hub (OCH)',  path: '/organic-os/connectors',                       icon: '🔗' },
      { label: 'Google Search Console', path: '/organic-os/connectors/google-search-console', icon: '🔍' },
      { label: 'Google Analytics 4',    path: '/organic-os/connectors/google-analytics-4',    icon: '📊' },
      { label: 'Google Trends',         path: '/organic-os/connectors/google-trends',         icon: '📈' },
      { label: 'Bing Webmaster',        path: '/organic-os/connectors/bing-webmaster',        icon: '🔵' },
      { label: 'RSS & Sitemap',         path: '/organic-os/connectors/rss-sitemap',           icon: '📡' },
      { label: 'WordPress',             path: '/organic-os/connectors/wordpress',             icon: '📝' },
      { label: 'Headless CMS',          path: '/organic-os/connectors/headless-cms',          icon: '⚡' },
      { label: 'Newsletter',            path: '/organic-os/connectors/newsletter',            icon: '✉️' },
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
