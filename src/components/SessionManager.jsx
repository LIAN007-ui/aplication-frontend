import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * SessionManager - Componente que monitorea la expiración del token JWT.
 * Cuando el token está por expirar, muestra un aviso.
 * Cuando expira, cierra la sesión automáticamente y redirige al login.
 */
const SessionManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const timerRef = useRef(null)
  const warningTimerRef = useRef(null)
  const [showWarning, setShowWarning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const countdownRef = useRef(null)

  // Decodificar el payload del JWT sin librerías externas
  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch {
      return null
    }
  }

  const doLogout = () => {
    // Limpiar todos los timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)

    // Limpiar localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('currentUser')

    setShowWarning(false)

    // Redirigir al login
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    // No ejecutar en páginas públicas
    const publicPaths = ['/login', '/register', '/', '/404', '/403', '/500']
    const currentPath = location.pathname
    if (publicPaths.includes(currentPath)) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) return

    const now = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = decoded.exp - now // segundos restantes

    if (timeUntilExpiry <= 0) {
      // Token ya expirado
      doLogout()
      return
    }

    // Mostrar advertencia 60 segundos antes de expirar
    const WARNING_SECONDS = 60
    const timeUntilWarning = Math.max(0, timeUntilExpiry - WARNING_SECONDS)

    // Timer para mostrar la advertencia
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      setSecondsLeft(WARNING_SECONDS)

      // Countdown cada segundo
      countdownRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(countdownRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, timeUntilWarning * 1000)

    // Timer para cerrar sesión al expirar
    timerRef.current = setTimeout(() => {
      doLogout()
    }, timeUntilExpiry * 1000)

    // Cleanup
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!showWarning) return null

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: #f59e0b; }
          50% { border-color: #ef4444; }
        }
        .session-warning-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-bottom: 3px solid #f59e0b;
          animation: slideDown 0.5s ease-out, pulse-border 2s ease-in-out infinite;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .session-warning-text {
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.95rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .session-warning-timer {
          background: rgba(239, 68, 68, 0.2);
          border: 2px solid #ef4444;
          color: #fca5a5;
          font-weight: 800;
          font-size: 1.1rem;
          padding: 4px 14px;
          border-radius: 8px;
          font-variant-numeric: tabular-nums;
          min-width: 45px;
          text-align: center;
        }
      `}</style>
      <div className="session-warning-bar">
        <span style={{ fontSize: '1.3rem' }}>⏳</span>
        <span className="session-warning-text">
          Tu sesión expirará pronto. Guarda tu trabajo.
        </span>
        <span className="session-warning-timer">
          {secondsLeft}s
        </span>
      </div>
    </>
  )
}

export default SessionManager
