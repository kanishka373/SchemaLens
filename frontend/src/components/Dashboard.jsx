import { useEffect, useState } from 'react'
import { Database, Link2, Rows3, Star } from 'lucide-react'

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (typeof target !== 'number') return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function SkeletonCard({ delay = 0 }) {
  return (
    <div style={{
      background: 'rgba(13, 17, 30, 0.6)',backdropFilter: 'blur(20px)',border: '1px solid rgba(255,255,255,0.04)',
      borderRadius: '16px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px',
      minHeight: '78px', overflow: 'hidden', position: 'relative'
    }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ width: '55%', height: '18px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginBottom: '8px' }} />
        <div style={{ width: '38%', height: '9px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)' }} />
      </div>
      <div style={{
        position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
        animation: `shimmer 1.5s ease-in-out ${delay}ms infinite`
      }} />
      <style>{`@keyframes shimmer { 100% { left: 100%; } }`}</style>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const animatedValue = useCountUp(visible && typeof value === 'number' ? value : 0)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div style={{
      background: 'rgba(13, 17, 30, 0.55)', backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px', padding: '18px 20px', position: 'relative', overflow: 'hidden', transition: 'all 0.35s ease', opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)', cursor: 'default',  display: 'flex',  alignItems: 'center',
      gap: '16px',  boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid ${color}35`
        e.currentTarget.style.boxShadow = `0 0 30px ${color}14, 0 8px 32px rgba(0,0,0,0.25)`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.03)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}>

      <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '120px', height: '120px', background: color, borderRadius: '50%', opacity: 0.08, filter: 'blur(30px)', pointerEvents: 'none' }} />

      {/* Icon box with soft glow ring */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: '-6px', background: color, opacity: 0.15, borderRadius: '16px', filter: 'blur(10px)' }} />
        <div style={{
          width: '44px', height: '44px', background: `${color}12`, borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${color}20`, position: 'relative',
        }}>
          <Icon size={20} color={color} strokeWidth={2} />
        </div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '26px',  fontWeight: '800',  lineHeight: 1,  marginBottom: '5px', color: color,
          filter: `drop-shadow(0 0 14px ${color}45)`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.3px',
        }}>
          {typeof value === 'number' ? animatedValue : value}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', letterSpacing: '0.4px', textTransform: 'uppercase' }}>{label}</div>
      </div>
    </div>
  )
}

function Dashboard({ stats }) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px'
  }

  if (!stats) {
    return (
      <div style={gridStyle}>
        {[0, 120, 240, 360].map((delay, i) => <SkeletonCard key={i} delay={delay} />)}
      </div>
    )
  }

  const cards = [
    { icon: Database, label: 'Total Tables', value: stats.totalTables, color: '#00d4ff', delay: 0 },
    { icon: Link2, label: 'Relationships', value: stats.totalRelationships, color: '#00ffcc', delay: 100 },
    { icon: Rows3, label: 'Total Columns', value: stats.totalColumns, color: '#a78bfa', delay: 200 },
    { icon: Star, label: 'Most Connected', value: stats.mostConnectedTable, color: '#f59e0b', delay: 300 },
  ]

  return (
    <div style={gridStyle}>
      {cards.map((card, i) => <StatCard key={i} {...card} />)}
    </div>
  )
}
export default Dashboard