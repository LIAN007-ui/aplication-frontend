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