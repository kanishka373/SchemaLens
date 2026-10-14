import { useState, useMemo } from 'react'
import { Table2, ChevronRight, Key, Link2, SearchX } from 'lucide-react'

const th = {
  textAlign: 'left',fontSize: 10,fontWeight: 500,textTransform: 'uppercase',letterSpacing: 1,color: '#64748b',padding: '8px 0',
}
const td = { padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }

function TablesView({ tables, relationships }) {
  // Set of table names that are currently expanded (several can be open together)
  const [open, setOpen] = useState(() => new Set())

  // "table.column" -> "parentTable.parentColumn" for every foreign key
  const fkMap = useMemo(() => {
    const m = new Map()
    relationships.forEach((r) => m.set(`${r.sourceTable}.${r.sourceColumn}`, `${r.targetTable}.${r.targetColumn}`))
    return m
  }, [relationships])

  const toggle = (name) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>Tables</h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Click a table to see its columns.</p>
        </div>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          {tables.length} table{tables.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
        {tables.length === 0 && (
          <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#64748b' }}>
            <SearchX size={28} />
            <span style={{ fontSize: 13 }}>No tables match your search.</span>
          </div>
        )}

        {tables.map((table) => {
          const isOpen = open.has(table.name)
          const cols = table.columns || []
          return (
            <div
              key={table.name}
              style={{
                flexShrink: 0, borderRadius: 12, overflow: 'hidden', background: 'rgba(13,17,30,0.85)', border: `1px solid ${isOpen ? 'rgba(0,212,255,0.35)' : 'rgba(0,212,255,0.12)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              {/* Row (always visible) */}
              <button
                onClick={() => toggle(table.name)}
                aria-expanded={isOpen}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: 'transparent', border: 'none',
                  color: '#e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Table2 size={16} color="#22d3ee" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {table.name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#22d3ee', background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.25)', padding: '2px 10px', borderRadius: 999 }}>
                  {cols.length} cols
                </span>
                <ChevronRight
                  size={16}
                  color="#64748b"
                  style={{ flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                />
              </button>

              {/* Details: height animates 0 -> auto using the grid-rows trick */}
              <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.25s ease' }}>
                <div style={{ overflow: 'hidden', minHeight: 0 }}>
                  <div style={{ borderTop: '1px solid rgba(0,212,255,0.12)', padding: '4px 16px 10px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      {/* fixed widths so every table's columns line up */}
                      <colgroup>
                        <col style={{ width: '28%' }} />
                        <col style={{ width: '16%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '28%' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={th}>Column</th>
                          <th style={th}>Type</th>
                          <th style={th}>Key</th>
                          <th style={th}>Nullable</th>
                          <th style={th}>References</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cols.map((col) => {
                          const ref = fkMap.get(`${table.name}.${col.name}`)
                          const isPk = col.key === 'PRI'
                          return (
                            <tr key={col.name}>
                              <td style={{ ...td, fontFamily: 'monospace', color: isPk ? '#fbbf24' : '#cbd5e1' }}>{col.name}</td>
                              <td style={td}>
                                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4 }}>
                                  {String(col.type || '').toUpperCase()}
                                </span>
                              </td>
                              <td style={td}>
                                {isPk && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', padding: '1px 6px', borderRadius: 4 }}>
                                    <Key size={10} /> PK
                                  </span>
                                )}
                                {ref && (
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#00ffcc', background: 'rgba(0,255,204,0.1)', border: '1px solid rgba(0,255,204,0.3)', padding: '1px 6px', borderRadius: 4 }}>
                                    <Link2 size={10} /> FK
                                  </span>
                                )}
                              </td>
                              <td style={{ ...td, fontSize: 11, fontWeight: 600, color: col.nullable ? '#f59e0b' : '#34d399' }}>
                                {col.nullable ? 'YES' : 'NO'}
                              </td>
                              <td style={{ ...td, fontFamily: 'monospace', fontSize: 11, color: '#5eead4' }}>{ref || ''}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TablesView