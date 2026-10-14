import { Database } from 'lucide-react'
function Navbar({ theme, toggleTheme, isConnected, onDisconnect, dbName }) {
  return (
    <nav style={{
      background: 'rgba(10, 14, 26, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(0,212,255,0.1)',
      padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 4px 30px rgba(0,0,0,0.4), 0 1px 0 rgba(0,212,255,0.08)'
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #00d4ff, #00ffcc)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(0,212,255,0.3)' }}><Database size={18} color="#0a0e1a" strokeWidth={2.2} /></div>
        <div>
          <span style={{ fontSize: '20px', fontWeight: '700', background: 'linear-gradient(135deg, #00d4ff, #00ffcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SchemaLens</span>
          <span style={{ fontSize: '11px', color: '#475569', display: 'block', marginTop: '-2px', letterSpacing: '0.3px' }}>Database Visualizer</span>
        </div>
      </div>

      {/* Center DB name */}
      {isConnected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,212,255,0.06)', padding: '6px 18px', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 15px rgba(0,212,255,0.1)' }}>
          <div style={{ width: '8px', height: '8px', background: '#00ffcc', borderRadius: '50%', boxShadow: '0 0 8px #00ffcc', animation: 'pulse 2s ease-in-out infinite' }} />
          <span style={{ color: '#00d4ff', fontSize: '14px', fontWeight: '500' }}>{dbName}</span>
        </div>
      )}

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isConnected && (
          <button onClick={onDisconnect} style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', color: '#ef4444', fontSize: '13px', fontWeight: '500', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.1)'; e.target.style.borderColor = '#ef4444'; e.target.style.boxShadow = '0 0 15px rgba(239,68,68,0.2)' }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(239,68,68,0.4)'; e.target.style.boxShadow = 'none' }}>
            Disconnect
          </button>
        )}
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }`}</style>
    </nav>
  )
}

export default Navbar