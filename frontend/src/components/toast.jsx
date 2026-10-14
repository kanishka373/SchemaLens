import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, FileText } from 'lucide-react'
let toastFn = null

export const showToast = (message, type = 'success') => {
  if (toastFn) toastFn(message, type)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (message, type) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3500)
    }
    return () => { toastFn = null }
  }, [])

   const icons = {
    success: <CheckCircle2 size={18} />, error: <XCircle size={18} />, info: <FileText size={18} />,
  }
  const colors = {
    success: { bg: 'rgba(0,255,200,0.08)', border: 'rgba(0,255,200,0.3)', color: '#00ffcc' },
    error: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
    info: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.3)', color: '#00d4ff' }
  }

  return (
    <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {toasts.map(toast => {
        const c = colors[toast.type] || colors.info
        return (
          <div key={toast.id} style={{
            background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(20px)', border: `1px solid ${c.border}`, borderRadius: '12px', padding: '12px 18px', display: 'flex',
            alignItems: 'center', gap: '10px',color: c.color, fontSize: '14px', fontWeight: '500', boxShadow: `0 0 20px ${c.border}, 0 10px 30px rgba(0,0,0,0.4)`,
            animation: 'toastIn 0.3s ease', minWidth: '260px'
          }}>
                        <span style={{ display: 'flex', flexShrink: 0 }}>{icons[toast.type] || icons.info}</span>
            {toast.message}
          </div>
        )
      })}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}