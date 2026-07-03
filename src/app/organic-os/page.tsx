export default function OrganicOSDashboard() {
  return (
    <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#e2e8f0', margin: 0, letterSpacing: '-1px' }}>
          Organic Traffic <span style={{ color: '#6366f1' }}>OS</span>
        </h1>
        <p style={{ color: '#64748b', marginTop: '8px', fontSize: '16px', fontWeight: '500' }}>
          Sistema Operacional de Tráfego Orgânico — Epic 03 Active
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total de Engines', value: '23', color: '#6366f1', icon: '⚡' },
          { label: 'Total de Rotas API', value: '97', color: '#10b981', icon: '🔗' },
          { label: 'Health Score', value: '100%', color: '#f59e0b', icon: '🛡️' },
          { label: 'Architecture', value: 'v3.0', color: '#818cf8', icon: '🏛️' },
          { label: 'Agents', value: '1', color: '#f43f5e', icon: '🤖' },
          { label: 'Epic', value: '03', color: '#6366f1', icon: '🚀' },
        ].map((card, i) => (
          <div key={i} style={{
            backgroundColor: '#0e1119', border: '1px solid #1d2133',
            borderRadius: '16px', padding: '24px',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>{card.icon}</div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
