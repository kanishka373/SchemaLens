import { Database, Server, Hash, User, LogOut, CheckCircle2 } from 'lucide-react'

const card = {
  padding: 20, borderRadius: 12,
  background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(0,212,255,0.12)',
}
const row = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 13,
}
const label = { display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }
const value = { fontFamily: 'monospace', color: '#e2e8f0' }

function Card({ title, children }) {
  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{title}</h3>
      {children}
    </div>
  )
}

function Settings({ dbConfig, tableCount, onDisconnect }) {
  const details = [
    { Icon: Server, name: 'Host', val: dbConfig?.host },
    { Icon: Hash, name: 'Port', val: dbConfig?.port },
    { Icon: User, name: 'User', val: dbConfig?.user },
    { Icon: Database, name: 'Database', val: dbConfig?.database },
  ]

  const stack = ['React', 'Vite', 'React Flow', 'Node.js', 'Express', 'MySQL']

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Settings</h2>
        <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Your current connection and project info.</p>
      </div>

      <Card title="Connection">
        <div style={{ ...row, borderTop: 'none' }}>
          <span style={label}><CheckCircle2 size={15} color="#00ffcc" /> Status</span>
          <span style={{ color: '#00ffcc', fontSize: 12, fontWeight: 600 }}>Connected · {tableCount} tables</span>
        </div>
        {details.map(({ Icon, name, val }) => (
          <div key={name} style={row}>
            <span style={label}><Icon size={15} /> {name}</span>
            <span style={value}>{val || '-'}</span>
          </div>
        ))}
      </Card>

      <Card title="Session">
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
          Disconnecting clears the loaded schema. You can connect to another database afterwards.
        </p>
        <button
          onClick={onDisconnect}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171',
          }}
        >
          <LogOut size={15} /> Disconnect
        </button>
      </Card>

      <Card title="About SchemaLens">
        <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 12px' }}>
          Visualise any MySQL database: tables, columns and foreign keys as an interactive graph.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {stack.map((s) => (
            <span key={s} style={{
              fontSize: 11, fontWeight: 600, color: '#22d3ee', padding: '3px 10px', borderRadius: 999,
              background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)',
            }}>{s}</span>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Settings