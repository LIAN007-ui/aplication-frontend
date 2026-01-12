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
