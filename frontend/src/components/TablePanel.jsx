import { X } from 'lucide-react'
function TablePanel({ table, onClose }) {
  if (!table) return null

  const getKeyBadge = (key) => {
    if (key === 'PRI') {
      return {
        label: 'PK', color: '#f59e0b',
        bg: 'rgba(245,158,11,0.12)',
        border: 'rgba(245,158,11,0.35)',
        glow: 'rgba(245,158,11,0.18)'
      }
    }

    if (key === 'MUL') {
      return {
        label: 'FK',
        color: '#00d4ff',
        bg: 'rgba(0,212,255,0.12)',
        border: 'rgba(0,212,255,0.35)',
        glow: 'rgba(0,212,255,0.18)'
      }
    }

    if (key === 'UNI') {
      return {
        label: 'UNI',
        color: '#a78bfa',
        bg: 'rgba(167,139,250,0.12)',
        border: 'rgba(167,139,250,0.35)',
        glow: 'rgba(167,139,250,0.18)'
      }
    }

    return null
  }

  return (
    <div
      style={{
        padding: '20px',
        height: 'fit-content',
        position: 'sticky',
        top: '80px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        background: 'rgba(13,17,30,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.22)',
        borderRadius: '14px',
        boxShadow:
          '0 0 30px rgba(0,212,255,0.08), 0 20px 40px rgba(0,0,0,0.4)'
      }}
    >

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#00d4ff',
              marginBottom: '3px'
            }}
          >
            {table.name}
          </h3>

          <span
            style={{
              fontSize: '12px',
              color: '#94a3b8'
            }}
          >
            {table.columns?.length || 0} columns
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#94a3b8',
            fontSize: '16px',
            transition: 'all 0.25s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'
            e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
            e.currentTarget.style.boxShadow = '0 0 15px rgba(0,212,255,0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#94a3b8'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
         <X size={16} />
        </button>
      </div>

      {/* Columns */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '9px'
        }}
      >
        {table.columns?.map((col, i) => {
          const badge = getKeyBadge(col.key)

          return (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,0.035)',
                borderRadius: '9px',
                padding: '11px 12px',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'all 0.25s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background =
                  'rgba(0,212,255,0.055)'
                e.currentTarget.style.borderColor =
                  'rgba(0,212,255,0.22)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background =
                  'rgba(255,255,255,0.035)'
                e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >

                {/* Column name */}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#f1f5f9'
                  }}
                >
                  {col.name}
                </span>

                {/* Badges */}
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center'
                  }}
                >

                  {badge && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: '800',
                        letterSpacing: '0.5px',
                        color: badge.color,
                        background: badge.bg,
                        padding: '3px 7px',
                        borderRadius: '5px',
                        border: `1px solid ${badge.border}`,
                        boxShadow: `0 0 10px ${badge.glow}`,
                        minWidth: '28px',
                        textAlign: 'center'
                      }}
                    >
                      {badge.label}
                    </span>
                  )}

                  {/* Data type */}
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.09)',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      border: '1px solid rgba(148,163,184,0.16)'
                    }}
                  >
                    {col.type}
                  </span>

                </div>
              </div>

              
              {!col.nullable && (
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    letterSpacing: '0.4px',
                    color: '#fb7185',
                    marginTop: '6px',
                    display: 'inline-block',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.18)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  NOT NULL
                </span>
              )}

            </div>
          )
        })}
      </div>

      {/* Row Count */}
      <div
        style={{
          marginTop: '16px',
          padding: '11px',
          background: 'rgba(0,212,255,0.045)',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid rgba(0,212,255,0.12)'
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: '#64748b'
          }}
        >
          Approx. Rows:{' '}
        </span>

        <span
          style={{
            fontSize: '13px',
            color: '#00ffcc',
            fontWeight: '700',
            textShadow: '0 0 10px rgba(0,255,204,0.4)'
          }}
        >
          {table.rows ?? 'N/A'}
        </span>
      </div>

    </div>
  )
}

export default TablePanel
