import { useState } from 'react'
import { Link2, Search, ArrowRight, Wrench } from 'lucide-react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ConnectForm from './components/ConnectForm'
import Dashboard from './components/Dashboard'
import Insights from './components/Insights'
import SchemaGraph from './components/SchemaGraph'
import TablePanel from './components/TablePanel'
import SearchBar from './components/SearchBar'
import TablesView from './components/TablesView'
import { showToast } from './components/toast'
import Settings from './components/Settings'

function MiniStat({ value, label }) {
  return (
    <div style={{ textAlign: 'center', padding: '0 18px' }}>
      <div style={{ fontSize: '22px', fontWeight: '800', color: '#00d4ff', lineHeight: 1, marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</div>
    </div>
  )
}

function RelationshipsView({ relationships, onViewInGraph }) {
  const [query, setQuery] = useState('')

  const filtered = relationships.filter(rel => {
    const q = query.toLowerCase()
    return rel.sourceTable.toLowerCase().includes(q) || rel.targetTable.toLowerCase().includes(q) ||
      rel.sourceColumn.toLowerCase().includes(q) || rel.targetColumn.toLowerCase().includes(q)
  })

  const tablesLinked = new Set()
  relationships.forEach(r => { tablesLinked.add(r.sourceTable); tablesLinked.add(r.targetTable) })
  const fkColumns = new Set(relationships.map(r => `${r.sourceTable}.${r.sourceColumn}`))

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: '0 0 2px' }}>Relationships</h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{relationships.length} relationships found</p>
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-around', background: 'rgba(13,17,30,0.55)',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px 0',
      }}>
        <MiniStat value={relationships.length} label="Relationships" />
        <MiniStat value={tablesLinked.size} label="Tables Linked" />
        <MiniStat value={fkColumns.size} label="FK Columns" />
      </div>

      <div style={{ position: 'relative' }}>
        <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search relationships..."
          style={{
            width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '10px 14px 10px 38px', color: '#e2e8f0', fontSize: '13px',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((rel, i) => (
          <div key={i} style={{
            background: 'rgba(13,17,30,0.6)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,212,255,0.1)', borderRadius: '12px', padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.border = '1px solid rgba(0,212,255,0.3)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.border = '1px solid rgba(0,212,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <Link2 size={15} color="#00ffcc" style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '13px' }}>
                <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{rel.sourceTable}</span>
                <span style={{ color: '#64748b' }}>.{rel.sourceColumn}</span>
                <ArrowRight size={13} color="#00d4ff" />
                <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{rel.targetTable}</span>
                <span style={{ color: '#64748b' }}>.{rel.targetColumn}</span>
              </div>
            </div>
            <button
              onClick={() => onViewInGraph(rel.sourceTable)}
              style={{
                flexShrink: 0, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)',
                borderRadius: '8px', padding: '6px 12px', color: '#00d4ff', fontSize: '11px', fontWeight: '600',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.08)' }}
            >
              View in Graph
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', marginTop: '30px' }}>No relationships match your search</div>
        )}
      </div>
    </div>
  )
}

function ComingSoon({ label }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#475569', gap: '10px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Wrench size={20} color="#64748b" />
      </div>
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>{label}</div>
      <div style={{ fontSize: '12px' }}>Coming soon — arriving with multi-user support</div>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState('dark')
  const [dbConfig, setDbConfig] = useState(null)
  const [tables, setTables] = useState([])
  const [relationships, setRelationships] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [graphFocus, setGraphFocus] = useState(null)

  const handleViewInGraph = (tableName) => {
    setGraphFocus({ name: tableName, key: Date.now() })
    setActiveSection('graph')
  }

  const handleConnect = (config, data) => {
    setDbConfig(config)
    setTables(data.tables || [])
    setRelationships(data.relationships || [])
    setStats(data.stats || null)
    setIsLoading(true) // sirf loading screen dikhao
  }

  const handleLoadingDone = () => {
    setIsLoading(false)
    setIsConnected(true)
    setActiveSection('dashboard')
    showToast(`Connected to "${dbConfig.database}"`, 'success')
  }

  const handleDisconnect = () => {
    setDbConfig(null)
    setTables([])
    setRelationships([])
    setStats(null)
    setSelectedTable(null)
    setIsConnected(false)
    showToast('Disconnected from database', 'info')
  }

  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <Dashboard stats={{ ...stats, totalRelationships: relationships.length }} />
            <Insights tables={tables} relationships={relationships} />
          </>
        )
      case 'graph':
        return (
          <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selectedTable ? '1fr 260px' : '1fr', gap: '12px', minHeight: 0 }}>
              <SchemaGraph
                tables={filteredTables}
                relationships={relationships}
                onSelectTable={setSelectedTable}
                selectedTable={selectedTable}
                focusTable={graphFocus}
                onExportSuccess={() => showToast('PDF exported successfully!', 'info')}
              />
              {selectedTable && <TablePanel table={selectedTable} onClose={() => setSelectedTable(null)} />}
            </div>
          </>
        )
      case 'tables':
        return (
          <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <TablesView tables={filteredTables} relationships={relationships} />
          </>
        )
      case 'relationships':
        return <RelationshipsView relationships={relationships} onViewInGraph={handleViewInGraph} />
      case 'settings':
        return <Settings dbConfig={dbConfig} tableCount={tables.length} onDisconnect={handleDisconnect} />
      default:
        return null
    }
  }

  return (
    <div className={theme} style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Navbar
        theme={theme}
        toggleTheme={(newTheme) => setTheme(newTheme)}
        isConnected={isConnected}
        onDisconnect={handleDisconnect}
        dbName={dbConfig?.database}
      />

      {isLoading ? (
        <LoadingScreen onDone={handleLoadingDone} />
      ) : !isConnected ? (
        <ConnectForm onConnect={handleConnect} />
      ) : (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
          <Sidebar active={activeSection} onNavigate={setActiveSection} dbName={dbConfig?.database} onDisconnect={handleDisconnect} />

          <div style={{
            flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column',
            gap: '12px', overflow: 'hidden',
          }}>
            {renderSection()}
          </div>
        </div>
      )}
    </div>
  )
}

export default App