import { useState, useEffect, useRef, useMemo } from 'react'
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, MarkerType,  getNodesBounds, useNodesState, useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import { Network, Maximize2, Download, Loader2 } from 'lucide-react'
import TableNode, { NODE_W, nodeHeight } from './TableNode'

// Must live outside the component, otherwise React Flow re-registers it every render.
const nodeTypes = { tableNode: TableNode }

const GAP_X = 150 // horizontal space between columns (room for the elbow lines + labels)
const GAP_Y = 36  // vertical space between tables in the same column
const PAD = 40

function computeLayout(tables, relationships) {
  const names = tables.map((t) => t.name)
  const nameSet = new Set(names)
  const tableByName = new Map(tables.map((t) => [t.name, t]))

  const parentsOf = new Map(names.map((n) => [n, []]))
  const linked = new Set()
  relationships.forEach((r) => {
    if (!nameSet.has(r.sourceTable) || !nameSet.has(r.targetTable)) return
    linked.add(r.sourceTable)
    linked.add(r.targetTable)
    if (r.sourceTable !== r.targetTable) parentsOf.get(r.sourceTable).push(r.targetTable)
  })

  // level = longest chain of parents above the table (cycle-safe)
  const level = new Map()
  const visiting = new Set()
  const getLevel = (n) => {
    if (level.has(n)) return level.get(n)
    if (visiting.has(n)) return 0
    visiting.add(n)
    const ps = parentsOf.get(n)
    const l = ps.length ? Math.max(...ps.map(getLevel)) + 1 : 0
    visiting.delete(n)
    level.set(n, l)
    return l
  }
  names.forEach(getLevel)

  const columns = []
  names.forEach((n) => {
    const l = level.get(n)
    if (!columns[l]) columns[l] = []
    columns[l].push(n)
  })

  const pos = new Map()
  const centerY = (n) => pos.get(n).y + nodeHeight(tableByName.get(n)) / 2

  columns.forEach((group, l) => {
    if (!group) return
    if (l === 0) {
      // connected tables first, loose tables at the bottom
      group.sort((a, b) => (linked.has(b) - linked.has(a)) || a.localeCompare(b))
    } else {
      // sit next to the parents to keep lines short and uncrossed
      const bary = (n) => {
        const ps = parentsOf.get(n)
        return ps.reduce((s, p) => s + centerY(p), 0) / ps.length
      }
      group.sort((a, b) => bary(a) - bary(b))
    }
    let y = PAD
    group.forEach((n) => {
      pos.set(n, { x: PAD + l * (NODE_W + GAP_X), y })
      y += nodeHeight(tableByName.get(n)) + GAP_Y
    })
  })

  return pos
}

function buildNodes(tables, relationships) {
  const pos = computeLayout(tables, relationships)
  const fk = new Map()
  const linked = new Map()
  const add = (m, t, c) => {
    if (!m.has(t)) m.set(t, new Set())
    m.get(t).add(c)
  }
  relationships.forEach((r) => {
    add(fk, r.sourceTable, r.sourceColumn)
    add(linked, r.sourceTable, r.sourceColumn)
    add(linked, r.targetTable, r.targetColumn)
  })

  return tables.map((t, i) => {
    const cols = t.columns || []
    return {
      id: t.name,
      type: 'tableNode',
      position: pos.get(t.name) || { x: 0, y: 0 },
      data: {
        name: t.name,
        columns: cols,
        pkCols: cols.filter((c) => c.key === 'PRI').map((c) => c.name),
        fkCols: [...(fk.get(t.name) || [])],
        linkedCols: [...(linked.get(t.name) || [])],
        index: i,
      },
    }
  })
}

/**
 * Owns the node state (so tables can be dragged). It is remounted via `key` whenever
 * a new schema arrives, so layout + fitView always run on a fresh graph.
 */
function GraphCanvas({ tables, relationships, highlighted, onNodeClick, onPaneClick }) {
  const [nodes, , onNodesChange] = useNodesState(() => buildNodes(tables, relationships))

  const connected = useMemo(() => {
    const set = new Set()
    if (highlighted) {
      set.add(highlighted)
      relationships.forEach((r) => {
        if (r.sourceTable === highlighted) set.add(r.targetTable)
        if (r.targetTable === highlighted) set.add(r.sourceTable)
      })
    }
    return set
  }, [highlighted, relationships])

  // Highlight / dim is derived, not stored - so dragging never gets reset by it.
  const displayNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          selected: highlighted === n.id,
          dimmed: !!highlighted && !connected.has(n.id),
        },
      })),
    [nodes, highlighted, connected]
  )

  const edges = useMemo(() => {
    const exists = new Set(nodes.map((n) => n.id))
    return relationships
      .filter((r) => exists.has(r.sourceTable) && exists.has(r.targetTable))
      .map((r, i) => {
        const isHi = !!highlighted && (r.sourceTable === highlighted || r.targetTable === highlighted)
        const isDim = !!highlighted && !isHi
        const color = isHi ? '#00ffcc' : 'rgba(0,212,255,0.55)'
        return {
          id: `e-${i}-${r.sourceTable}-${r.sourceColumn}`,
          // line flows parent -> child (left to right); the arrow still points at the parent
          source: r.targetTable,
          target: r.sourceTable,
          sourceHandle: `${r.targetColumn}-r`,
          targetHandle: `${r.sourceColumn}-l`,
          type: 'smoothstep',
          animated: isHi,
          label: `${r.sourceColumn} → ${r.targetColumn}`,
          labelStyle: { fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' },
          labelBgStyle: { fill: '#0a0e1a' },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 4,
          markerStart: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
          style: { stroke: color, strokeWidth: isHi ? 2.2 : 1.5, opacity: isDim ? 0.12 : 1 },
        }
      })
  }, [relationships, nodes, highlighted])

  return (
    <ReactFlow
      nodes={displayNodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      colorMode="dark"
      fitView
      fitViewOptions={{ padding: 0.10 }}
      minZoom={0.15}
      maxZoom={1.8}
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
      style={{ background: '#0a0e1a' }}
    >
      <Background bgColor="#0a0e1a" color="rgba(148,163,184,0.16)" gap={26} size={1} />
      <Controls showInteractive={false} />
      <MiniMap
        pannable
        zoomable
        nodeColor={(n) => (n.data?.selected ? '#00ffcc' : '#1e3a4f')}
        nodeStrokeWidth={2}
        maskColor="rgba(5,8,15,0.7)"
      />
    </ReactFlow>
  )
}

function SchemaGraphInner({ tables, relationships, onSelectTable, onExportSuccess, focusTable }) {
  const [highlighted, setHighlighted] = useState(null)
  const [exporting, setExporting] = useState(false)
  const areaRef = useRef(null)
  const { fitView, getNodes } = useReactFlow()

  // External trigger (e.g. "View in Schema Graph" on the Relationships page)
  useEffect(() => {
    if (focusTable?.name) setHighlighted(focusTable.name)
  }, [focusTable])

  // `tables` is a new array on every parent render, so key off its content instead.
  const schemaKey = tables.map((t) => t.name).join(',') + '|' + relationships.length

  const handleNodeClick = (_, node) => {
    const table = tables.find((t) => t.name === node.id)
    if (table) onSelectTable(table)
    setHighlighted((prev) => (prev === node.id ? null : node.id))
  }

  const handleExport = async () => {
    setExporting(true)
    const area = areaRef.current
    // Freeze CSS animations while the snapshot is taken (otherwise nodes can come out half-faded).
    area.classList.add('sl-exporting')
    try {
      // Export the WHOLE graph (not just what is on screen), at 1:1 size, without minimap / buttons.
      const PAD = 40
      const bounds = getNodesBounds(getNodes())
      const w = Math.ceil(bounds.width + PAD * 2)
      const h = Math.ceil(bounds.height + PAD * 2)
      const imgData = await toPng(area.querySelector('.react-flow__viewport'), {
        backgroundColor: '#0a0e1a',
        width: w, height: h, pixelRatio: 2,
        style: {  width: `${w}px`,  height: `${h}px`, transform: `translate(${PAD - bounds.x}px, ${PAD - bounds.y}px) scale(1)`,
        },
      })
      const pdf = new jsPDF({ orientation: w >= h ? 'landscape' : 'portrait', unit: 'px', format: [w, h] })
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      pdf.save('schemalens-schema.pdf')
      if (onExportSuccess) onExportSuccess()
    } catch (err) {
      console.error(err)
    } finally {
      area.classList.remove('sl-exporting')
      setExporting(false)
    }
  }

  const ghostBtn = {
    display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px', padding: '5px 12px', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
  }

  return (
    <div style={{ height: '100%', minHeight: 360, background: '#0a0e1a', borderRadius: '12px', border: '1px solid rgba(0,212,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,212,255,0.05)' }}>
      <style>{`
        @keyframes slNodeIn { from { opacity: 0; transform: translateY(8px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes slSpin { to { transform: rotate(360deg); } }
        .sl-spin { animation: slSpin 0.8s linear infinite; }
        .react-flow__controls { border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.4); }
        .react-flow__controls-button { background: #0d1117; border-bottom: 1px solid #1e293b; color: #94a3b8; }
        .react-flow__controls-button:hover { background: #16202e; }
        .react-flow__controls-button svg { fill: currentColor; }
        .react-flow__minimap { background: #0d1117; border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; }
        .react-flow__edge-textbg { rx: 4; }
        .sl-exporting * { animation: none !important; transition: none !important; }
      `}</style>

      {/* Toolbar */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,212,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: '8px', background: 'rgba(10,14,26,0.9)', flexShrink: 0, position: 'relative', zIndex: 5 }}>
        <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Network size={14} />
          {tables.length} tables · {relationships.length} relationships
          {highlighted && <span style={{ color: '#00ffcc', marginLeft: '8px' }}>· Highlighting: {highlighted}</span>}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => fitView({ padding: 0.12, duration: 400 })}
            style={ghostBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#e2e8f0' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94a3b8' }}
          >
            <Maximize2 size={13} /> Fit All
          </button>
          {highlighted && (
            <button
              onClick={() => setHighlighted(null)}
              style={{ background: 'rgba(0,255,204,0.08)', border: '1px solid rgba(0,255,204,0.3)', borderRadius: '6px', padding: '5px 12px', color: '#00ffcc', fontSize: '12px', cursor: 'pointer' }}
            >
              Clear Highlight
            </button>
          )}
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #00d4ff, #00ffcc)', border: 'none', borderRadius: '6px', padding: '6px 14px', color: '#0a0e1a', fontSize: '12px', fontWeight: '700', cursor: 'pointer', opacity: exporting ? 0.7 : 1, boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}
          >
            {exporting ? <Loader2 size={13} className="sl-spin" /> : <Download size={13} />}
            {exporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Graph area (React Flow needs a parent with a real height) */}
      <div ref={areaRef} style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <GraphCanvas
          key={schemaKey}
          tables={tables}
          relationships={relationships}
          highlighted={highlighted}
          onNodeClick={handleNodeClick}
          onPaneClick={() => setHighlighted(null)}
        />
      </div>
    </div>
  )
}

function SchemaGraph(props) {
  return (
    <ReactFlowProvider>
      <SchemaGraphInner {...props} />
    </ReactFlowProvider>
  )
}

export default SchemaGraph