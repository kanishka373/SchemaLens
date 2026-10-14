import { useState } from 'react'
import { LayoutDashboard, Waypoints, Table2, Link2, Settings, LogOut, Database } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'graph', label: 'Schema Graph', icon: Waypoints },
  { id: 'tables', label: 'Table Explorer', icon: Table2 },
  { id: 'relationships', label: 'Relationships', icon: Link2 },
]

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = useState(false)
  const Icon = item.icon
  const isActive = active === item.id

  return (
    <button
      onClick={() => onClick(item.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',  display: 'flex',  alignItems: 'center',  gap: '11px',  padding: '9px 12px',  borderRadius: '11px',
        border: isActive ? '1px solid rgba(0,212,255,0.28)' : '1px solid transparent', background: isActive  ? 'rgba(0,212,255,0.1)'
          : hover ? 'rgba(0,212,255,0.06)' : 'transparent',color: isActive ? '#00d4ff' : '#64748b',fontSize: '13px',fontWeight: isActive ? '600' : '500',
        cursor: 'pointer', position: 'relative', transition: 'all 0.25s ease', transform: hover && !isActive ? 'translateX(2px)' : 'translateX(0)', textAlign: 'left',
        boxShadow: isActive ? '0 0 18px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
      }}
    >
      <div style={{
        width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isActive
          ? 'rgba(0,212,255,0.18)'
          : hover ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.025)',
        border: isActive ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.25s ease',
      }}>
        <Icon size={15} strokeWidth={2.2} style={{
          filter: isActive ? 'drop-shadow(0 0 6px #00d4ff90)' : 'none',
          transition: 'filter 0.25s ease',
        }} />
      </div>
      <span style={{ flex: 1 }}>{item.label}</span>
      {isActive && (
        <div style={{
          position: 'absolute', bottom: '2px', left: '12px', right: '12px', height: '2px',
          background: 'linear-gradient(90deg, #00d4ff, transparent)', borderRadius: '2px',
        }} />
      )}
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '10px', fontWeight: '700', color: '#334155',
      letterSpacing: '1.2px', textTransform: 'uppercase',
      padding: '0 12px', marginBottom: '8px', marginTop: '18px',
    }}>
      {children}
    </div>
  )
}

function Sidebar({ active, onNavigate, dbName, onDisconnect }) {
  return (
    <div style={{
      width: '226px',    flexShrink: 0, height: '100%', background: 'rgba(10,14,26,0.92)', backdropFilter: 'blur(14px)', borderRight: '1px solid rgba(0,212,255,0.08)',
      display: 'flex', flexDirection: 'column', padding: '18px 12px', boxSizing: 'border-box',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,255,204,0.12))', border: '1px solid rgba(0,212,255,0.28)',  display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 18px rgba(0,212,255,0.18)',
        }}>
          <Database size={17} color="#00d4ff" strokeWidth={2.2} />
        </div>
        <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '0.3px' }}>SchemaLens</div>
      </div>

      {/* Nav */}
      <SectionLabel>Workspace</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.id} item={item} active={active} onClick={onNavigate} />
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Database status card */}
      <SectionLabel>Database</SectionLabel>
      <div style={{
        background: 'rgba(0,212,255,0.05)',  border: '1px solid rgba(0,212,255,0.15)',  borderRadius: '12px', padding: '11px 12px',  marginBottom: '8px',  boxShadow: '0 0 15px rgba(0,212,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00ffcc', boxShadow: '0 0 8px #00ffcc', flexShrink: 0 }} />
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {dbName || 'No database'}
          </span>
        </div>
        <div style={{ fontSize: '10.5px', color: '#64748b', paddingLeft: '14px' }}>
          MySQL · Connected
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button
          onClick={() => onNavigate('settings')}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.06)'; e.currentTarget.style.color = '#e2e8f0' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '11px',
            padding: '8px 12px', borderRadius: '10px', border: 'none',background: 'transparent', color: '#64748b', fontSize: '12.5px',fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease',
          }}
        >
          <Settings size={15} />
          Settings
        </button>
        <button
          onClick={onDisconnect}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '10px', border: '1px solid rgba(248,113,113,0.18)', background: 'rgba(248,113,113,0.06)', color: '#f87171', fontSize: '12.5px',
            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.14)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(248,113,113,0.12)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.06)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <LogOut size={15} />
          Disconnect
        </button>
      </div>
    </div>
  )
}

export default Sidebar