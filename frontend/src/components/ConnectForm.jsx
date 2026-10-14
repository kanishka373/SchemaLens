import { useState, useEffect, useRef } from 'react'
import { Database, Server, Hash, User, Lock, Eye, EyeOff, Zap, ShieldCheck, CheckCircle2,AlertTriangle } from 'lucide-react'
import { connectAndFetch } from '../services/api.js'

function ConnectForm({ onConnect }) {
  const [config, setConfig] = useState({
    host: 'localhost', port: '3306', user: 'root', password: 'root', database: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const nodesRef = useRef([])
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const SPACING = 65

    const buildNodes = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      nodesRef.current = []
      const cols = Math.ceil(canvas.width / SPACING) + 2
      const rows = Math.ceil(canvas.height / SPACING) + 2
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          nodesRef.current.push({
            baseX: i * SPACING,
            baseY: j * SPACING,
            x: i * SPACING, y: j * SPACING,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.2,
            amp: 6 + Math.random() * 8,
          })
        }
      }
    }

    buildNodes()
    window.addEventListener('resize', buildNodes)

    const draw = () => {
      timeRef.current += 0.004
      const t = timeRef.current
      const nodes = nodesRef.current

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      nodes.forEach(node => {
        node.x = node.baseX + Math.sin(t * node.speed + node.phaseX) * node.amp
        node.y = node.baseY + Math.cos(t * node.speed + node.phaseY) * node.amp
      })

      // lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxD = SPACING * 1.6
          if (dist < maxD) {
            const opacity = (1 - dist / maxD) * 0.1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(0,212,255,${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // dots
      nodes.forEach(node => {
        ctx.beginPath()
        ctx.arc(node.x, node.y, 1.1, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,212,255,0.18)'
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', buildNodes)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  const handleChange = (e) => setConfig(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleQuickFill = () => {
    setConfig({ host: 'localhost', port: '3306', user: 'root', password: 'root', database: 'test' })
  }

  const handleSubmit = async () => {
    if (!config.database || !config.user) { setError('Database name and user are required!'); return }
    setLoading(true); setError('')
    try {
      const data = await connectAndFetch(config)
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        onConnect(config, data)
      }, 1100)
    } catch (err) {
      setError(err.message || 'Connection failed!')
      setLoading(false)
    }
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: focusedField === name ? '1px solid #00d4ff' : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '11px 14px 11px 38px',
    color: '#e2e8f0', fontSize: '14px', outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedField === name ? '0 0 0 3px rgba(0,212,255,0.1), 0 0 15px rgba(0,212,255,0.1)' : 'none',
    boxSizing: 'border-box'
  })

  const iconWrapStyle = { position: 'relative' }
  const fieldIconStyle = (name) => ({
    position: 'absolute', left: '12px', top: '38px',
    color: focusedField === name ? '#00d4ff' : '#475569',
    transition: 'color 0.3s ease', pointerEvents: 'none'
  })

  const labelStyle = {
    fontSize: '11px', fontWeight: '600', color: '#94a3b8',
    marginBottom: '6px', display: 'block', letterSpacing: '0.8px', textTransform: 'uppercase'
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'fixed', top: '15%', left: '8%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)', borderRadius: '50%', animation: 'blob1 9s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '8%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(0,255,200,0.05) 0%, transparent 70%)', borderRadius: '50%', animation: 'blob2 11s ease-in-out infinite', pointerEvents: 'none', zIndex: 0 }} />

      <style>{`
        @keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(25px,-18px) scale(1.04)}}
        @keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-18px,14px) scale(0.96)}}
        @keyframes pulse-ring{0%{transform:scale(0.85);opacity:1}100%{transform:scale(1.45);opacity:0}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes borderPulse{
          0%,100%{box-shadow:0 0 15px rgba(0,212,255,0.2),0 0 50px rgba(0,212,255,0.06),0 25px 60px rgba(0,0,0,0.6);border-color:rgba(0,212,255,0.25)}
          50%{box-shadow:0 0 30px rgba(0,212,255,0.5),0 0 80px rgba(0,212,255,0.15),0 25px 60px rgba(0,0,0,0.6);border-color:rgba(0,212,255,0.65)}
        }
        input::placeholder{color:#334155}
      `}</style>

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '18px' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #00d4ff, #00ffcc)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}>
              <Database size={28} color="#0a0e1a" strokeWidth={2.4} />
            </div>
            <div style={{ position: 'absolute', inset: '-4px', borderRadius: '20px', border: '1px solid rgba(0,212,255,0.4)', animation: 'pulse-ring 2s ease-out infinite' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #00d4ff 0%, #00ffcc 50%, #a78bfa 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px', animation: 'shimmer 4s linear infinite' }}>Connect Database</h1>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '10px' }}>Enter your MySQL credentials to explore schema</p>
          <button onClick={handleQuickFill} style={{ background: 'none', border: 'none', color: '#00d4ff', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', opacity: 0.75, padding: 0 }}>
            Use demo credentials
          </button>
        </div>

        <div style={{ background: 'rgba(10,14,26,0.92)', backdropFilter: 'blur(28px)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: '20px', padding: '32px', animation: 'borderPulse 3s ease-in-out infinite' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '12px', marginBottom: '18px' }}>
            <div style={iconWrapStyle}>
              <label style={labelStyle}>Host</label>
              <Server size={15} style={fieldIconStyle('host')} />
              <input name="host" value={config.host} onChange={handleChange} onFocus={() => setFocusedField('host')} onBlur={() => setFocusedField(null)} placeholder="localhost" style={inputStyle('host')} />
            </div>
            <div style={iconWrapStyle}>
              <label style={labelStyle}>Port</label>
              <Hash size={15} style={fieldIconStyle('port')} />
              <input name="port" value={config.port} onChange={handleChange} onFocus={() => setFocusedField('port')} onBlur={() => setFocusedField(null)} placeholder="3306" style={inputStyle('port')} />
            </div>
          </div>
          <div style={{ ...iconWrapStyle, marginBottom: '18px' }}>
            <label style={labelStyle}>Username</label>
            <User size={15} style={fieldIconStyle('user')} />
            <input name="user" value={config.user} onChange={handleChange} onFocus={() => setFocusedField('user')} onBlur={() => setFocusedField(null)} placeholder="root" style={inputStyle('user')} />
          </div>
          <div style={{ ...iconWrapStyle, marginBottom: '18px' }}>
            <label style={labelStyle}>Password</label>
            <Lock size={15} style={fieldIconStyle('password')} />
            <input name="password" value={config.password} type={showPassword ? 'text' : 'password'} onChange={handleChange} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} placeholder="••••••••" style={{ ...inputStyle('password'), paddingRight: '38px' }} />
            <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '12px', top: '36px', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', padding: 0 }}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <div style={{ ...iconWrapStyle, marginBottom: '24px' }}>
            <label style={labelStyle}>Database Name</label>
            <Database size={15} style={fieldIconStyle('database')} />
            <input name="database" value={config.database} onChange={handleChange} onFocus={() => setFocusedField('database')} onBlur={() => setFocusedField(null)} placeholder="my_database" style={inputStyle('database')} />
          </div>

          {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} style={{ flexShrink: 0 }} /> {error}</div>}

          <button onClick={handleSubmit} disabled={loading || success}
            style={{ width: '100%', padding: '13px', background: success ? 'linear-gradient(135deg, #00ffcc, #00d4ff)' : loading ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg, #00d4ff, #00ffcc)', border: 'none', borderRadius: '12px', color: '#0a0e1a', fontSize: '15px', fontWeight: '700', cursor: (loading || success) ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: loading ? 'none' : '0 0 25px rgba(0,212,255,0.35)', letterSpacing: '0.3px' }}
            onMouseEnter={e => { if (!loading && !success) { e.target.style.transform = 'scale(1.02)'; e.target.style.boxShadow = '0 0 45px rgba(0,212,255,0.65)' } }}
            onMouseLeave={e => { if (!loading && !success) { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 0 25px rgba(0,212,255,0.35)' } }}>
            {success ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'popIn 0.35s ease' }}>
                <CheckCircle2 size={18} /> Connected
              </span>
            ) : loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(10,14,26,0.3)', borderTop: '2px solid #0a0e1a', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                Connecting...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Zap size={16} /> Connect & Explore
              </span>
            )}
          </button>

          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
          `}</style>
        </div>

        <p style={{ textAlign: 'center', color: '#334155', fontSize: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={13} /> Credentials are never stored
        </p>
      </div>
    </div>
  )
}

export default ConnectForm