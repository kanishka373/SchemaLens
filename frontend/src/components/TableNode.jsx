import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { Table2, Key, Link2 } from 'lucide-react'
export const NODE_W = 260
export const HEADER_H = 46
export const ROW_H = 28
export const BODY_PAD = 8
export const nodeHeight = (table) =>
  HEADER_H + BODY_PAD + (table.columns?.length || 0) * ROW_H

const ellipsis = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }

const typeBadge = {
  fontFamily: 'monospace', fontSize: 9, letterSpacing: 0.4, color: '#64748b', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', padding: '1px 6px',
  borderRadius: 4, flexShrink: 0,
}
const handleStyle = (visible) => ({
  width: 7, height: 7, minWidth: 0, minHeight: 0, background: '#00d4ff', border: '1.5px solid #0a0e1a', opacity: visible ? 1 : 0,
  pointerEvents: 'none',
})

function TableNode({ data }) {
  const { name, columns, pkCols, fkCols, linkedCols, selected, dimmed, index } = data
  const accent = selected ? '#00ffcc' : '#00d4ff'

  return (
    // Outer div only plays the entry animation. Opacity for "dimmed" lives on the
    // inner div, because a running CSS animation would override it.
    <div style={{ animation: 'slNodeIn 0.45s ease both', animationDelay: `${(index || 0) * 70}ms` }}>
      <div
        style={{
          width: NODE_W, borderRadius: 12, background: selected ? '#0d1f35' : '#0d1117',
          border: `1px solid ${selected ? '#00d4ff' : '#1e293b'}`,
          boxShadow: selected
            ? '0 0 0 1px rgba(0,212,255,0.35), 0 10px 30px rgba(0,212,255,0.18)'
            : '0 6px 18px rgba(0,0,0,0.45)', opacity: dimmed ? 0.22 : 1,
          transition: 'opacity 0.2s, border-color 0.2s, box-shadow 0.2s, background 0.2s', cursor: 'pointer',
        }}
      >
        {/* Header */}
        <div
          style={{ height: HEADER_H,display: 'flex', alignItems: 'center', gap: 10,padding: '0 12px', borderBottom: '1px solid #1e293b', borderRadius: '11px 11px 0 0',
            background: selected ? 'rgba(0,212,255,0.16)' : 'rgba(0,212,255,0.06)',
          }}
        >
          <div
            style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selected ? 'rgba(0,255,204,0.15)' : 'rgba(0,212,255,0.12)',
            }}
          >
            <Table2 size={14} color={accent} />
          </div>
          <span style={{ flex: 1, minWidth: 0, ...ellipsis, fontSize: 14, fontWeight: 700, color: accent }}>
            {name}
          </span>
          <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', flexShrink: 0 }}>
            {columns.length} cols
          </span>
        </div>

        {/* Columns */}
        <div style={{ padding: `${BODY_PAD / 2}px 0` }}>
          {columns.map((col) => {
            const isPk = pkCols.includes(col.name)
            const isFk = fkCols.includes(col.name)
            const linked = linkedCols.includes(col.name)
            return (
              <div
                key={col.name}
                style={{
                  position: 'relative', // handles position themselves against this row
                  height: ROW_H, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: isPk ? 'rgba(245,158,11,0.06)' : isFk ? 'rgba(0,212,255,0.05)' : 'transparent',
                }}
              >
                {/* One handle per column => edges attach to the exact FK / PK row */}
                <Handle id={`${col.name}-l`} type="target" position={Position.Left} isConnectable={false} style={handleStyle(linked)} />
                <span style={{ width: 14, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  {isPk ? <Key size={12} color="#f59e0b" /> : isFk ? <Link2 size={12} color="#00ffcc" /> : null}
                </span>
                <span
                  style={{
                    flex: 1, minWidth: 0, ...ellipsis,fontFamily: 'monospace', fontSize: 12,fontWeight: isPk ? 600 : 400,
                    color: isPk ? '#fbbf24' : isFk ? '#5eead4' : '#cbd5e1',
                  }}
                >
                  {col.name}
                </span>
                <span style={typeBadge}>{String(col.type || '').toUpperCase()}</span>

                <Handle id={`${col.name}-r`} type="source" position={Position.Right} isConnectable={false} style={handleStyle(linked)} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(TableNode)