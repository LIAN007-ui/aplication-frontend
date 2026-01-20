<<<<<<< HEAD
import React from 'react'

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null
  return (
    <div className="lo-overlay">
      <style>{`
        .lo-overlay{position:fixed;inset:0;background:rgba(3,10,22,0.45);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:2000}
        .lo-card{background:linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));border:1px solid rgba(255,255,255,0.08);backdrop-filter:blur(8px);padding:22px 28px;border-radius:14px;display:flex;flex-direction:column;align-items:center;box-shadow:0 8px 30px rgba(2,6,23,0.6);animation:lo-pop .26s ease both}
        @keyframes lo-pop{from{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}
        .lo-svg{width:92px;height:92px}
        .ring{fill:none;stroke-width:6;stroke-linecap:round}
        .ring.outer{stroke:url(#grad1);opacity:0.95;animation:rotate-cw 1.2s linear infinite}
        .ring.inner{stroke:url(#grad2);stroke-width:4;opacity:0.9;animation:rotate-ccw 1.1s linear infinite}
        @keyframes rotate-cw{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes rotate-ccw{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
        .lo-dot{width:12px;height:12px;border-radius:50%;background:linear-gradient(180deg,#87cefa,#003366);box-shadow:0 6px 18px rgba(3,10,23,0.5);margin-top:12px;animation:dot-bounce 1s ease-in-out infinite}
        @keyframes dot-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .lo-text{color:#eaf6ff;font-weight:700;margin-top:10px;font-size:14px;display:flex;align-items:center}
        .lo-dots span{display:inline-block;margin-left:4px;opacity:.85;animation:dot-fade 1s infinite steps(3,end)}
        .lo-dots span:nth-child(1){animation-delay:0s}
        .lo-dots span:nth-child(2){animation-delay:.15s}
        .lo-dots span:nth-child(3){animation-delay:.3s}
        @keyframes dot-fade{0%{opacity:.15}50%{opacity:1}100%{opacity:.15}}
      `}</style>

      <div className="lo-card" role="status" aria-live="polite">
        <svg className="lo-svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c7f9ff" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <g transform="translate(50,50)">
            <g className="ring outer" transform="rotate(0)">
              <path d="M0,-38 A38,38 0 1,1 -0.01,-38" strokeWidth="6" strokeLinecap="round" stroke="url(#grad1)" fill="none" />
            </g>
            <g className="ring inner" transform="rotate(0)">
              <path d="M0,-26 A26,26 0 1,0 -0.01,-26" strokeWidth="4" strokeLinecap="round" stroke="url(#grad2)" fill="none" />
            </g>
          </g>
        </svg>

        <div className="lo-dot" aria-hidden="true"></div>
        <div className="lo-text">Cargando<div className="lo-dots"><span>·</span><span>·</span><span>·</span></div></div>
      </div>
    </div>
  )
}

export default LoadingOverlay
=======
import React from 'react';

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="lo-overlay">
      <style>{`
        .lo-overlay {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          overflow: hidden;
        }

        /* Líneas cinéticas de fondo que cruzan la pantalla */
        .lo-overlay::before {
          content: '';
          position: absolute;
          inset: -100%;
          background-image: 
            linear-gradient(90deg, rgba(125, 211, 252, 0.03) 1px, transparent 1px),
            linear-gradient(0deg, rgba(125, 211, 252, 0.03) 1px, transparent 1px);
          background-size: 100px 100px;
          transform: rotate(-15deg);
          animation: grid-move 20s linear infinite;
        }

        @keyframes grid-move {
          from { transform: rotate(-15deg) translateY(0); }
          to { transform: rotate(-15deg) translateY(100px); }
        }

        /* Contenedor principal sin bordes ni fondos pequeños */
        .lo-main-content {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        /* SVG Grande y Central */
        .lo-svg-large {
          width: 280px; 
          height: 280px;
          filter: drop-shadow(0 0 30px rgba(14, 165, 233, 0.2));
          animation: pulse-svg 4s ease-in-out infinite;
        }

        @keyframes pulse-svg {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }

        .ring {
          fill: none;
          stroke-linecap: round;
          transform-origin: center;
        }

        /* Animación de trazo "natural" (que se dibuja y desdibuja) */
        .ring-outer {
          stroke: #38bdf8;
          stroke-width: 2;
          stroke-dasharray: 150 300;
          animation: rotate-natural 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        .ring-middle {
          stroke: #0ea5e9;
          stroke-width: 1.5;
          stroke-dasharray: 80 200;
          animation: rotate-natural 3s cubic-bezier(0.4, 0, 0.2, 1) infinite reverse;
        }

        .ring-inner {
          stroke: #7dd3fc;
          stroke-width: 4;
          stroke-dasharray: 5 120;
          animation: rotate-natural 1.5s linear infinite;
        }

        @keyframes rotate-natural {
          0% { transform: rotate(0deg); stroke-dashoffset: 0; }
          100% { transform: rotate(360deg); stroke-dashoffset: -450; }
        }

        /* Texto moderno y minimalista */
        .lo-status-container {
          position: absolute;
          bottom: 15%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .lo-text-big {
          color: #f8fafc;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          opacity: 0.6;
          animation: tracking-in 2s ease-out forwards;
        }

        @keyframes tracking-in {
          from { letter-spacing: -0.2em; opacity: 0; }
          to { letter-spacing: 0.5em; opacity: 0.6; }
        }

        /* Línea de progreso sutil en la parte inferior */
        .lo-progress-line {
          width: 120px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }

        .lo-progress-line::after {
          content: '';
          position: absolute;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, #38bdf8, transparent);
          animation: progress-slide 2s infinite cubic-bezier(0.65, 0, 0.35, 1);
        }

        @keyframes progress-slide {
          from { left: -100%; }
          to { left: 100%; }
        }
      `}</style>

      <div className="lo-main-content">
        {/* Círculo de Carga Grande */}
        <svg className="lo-svg-large" viewBox="0 0 200 200">
          {/* Círculos de referencia estáticos muy tenues */}
          <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
          <circle cx="100" cy="100" r="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
          
          {/* Círculos animados */}
          <circle cx="100" cy="100" r="90" className="ring ring-outer" />
          <circle cx="100" cy="100" r="70" className="ring ring-middle" />
          <circle cx="100" cy="100" r="50" className="ring ring-inner" />
        </svg>

        {/* Información de estado inferior */}
        <div className="lo-status-container">
          <div className="lo-text-big">Procesando Sistema</div>
          <div className="lo-progress-line"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
>>>>>>> 90e20dc (actualizacion visual)
