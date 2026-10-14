import { useMemo } from 'react'
import { Network, Table2, AlertTriangle } from 'lucide-react'

const card = { padding: 18, borderRadius: 12, background: 'rgba(13,17,23,0.8)', border: '1px solid rgba(0,212,255,0.12)' }
const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 13 }
const name = { fontFamily: 'monospace', color: '#cbd5e1' }

function Panel({ title, Icon, color, children }) {
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <Icon size={16} color={color} />
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Insights({ tables, relationships }) {
  const data = useMemo(() => {
    // har table ke kitne relationships hain (dono taraf se)
    const count = {}
    tables.forEach((t) => { count[t.name] = 0 })
    relationships.forEach((r) => {
      count[r.sourceTable] = (count[r.sourceTable] || 0) + 1
      count[r.targetTable] = (count[r.targetTable] || 0) + 1
    })

    const mostConnected = tables
      .map((t) => ({ name: t.name, value: count[t.name] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    const largest = tables
      .map((t) => ({ name: t.name, value: t.columns.length }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    const attention = []
    tables.forEach((t) => {
      if (count[t.name] === 0) attention.push({ name: t.name, why: 'No relationships' })
      if (!t.columns.some((c) => c.key === 'PRI')) attention.push({ name: t.name, why: 'No primary key' })
    })

    return { mostConnected, largest, attention }
  }, [tables, relationships])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
      <Panel title="Most connected tables" Icon={Network} color="#00d4ff">
        {data.mostConnected.map((t) => (
          <div key={t.name} style={row}>
            <span style={name}>{t.name}</span>
            <span style={{ color: '#00ffcc', fontSize: 12 }}>{t.value} links</span>
          </div>
        ))}
      </Panel>

      <Panel title="Largest tables" Icon={Table2} color="#a78bfa">
        {data.largest.map((t) => (
          <div key={t.name} style={row}>
            <span style={name}>{t.name}</span>
            <span style={{ color: '#a78bfa', fontSize: 12 }}>{t.value} cols</span>
          </div>
        ))}
      </Panel>

      <Panel title="Needs attention" Icon={AlertTriangle} color="#f59e0b">
        {data.attention.length === 0 && <div style={{ ...row, color: '#34d399' }}>All tables look healthy.</div>}
        {data.attention.map((t, i) => (
          <div key={i} style={row}>
            <span style={name}>{t.name}</span>
            <span style={{ color: '#f59e0b', fontSize: 12 }}>{t.why}</span>
          </div>
        ))}
      </Panel>
    </div>
  )
}

export default Insights