// ============================================================
// CricketField.tsx — 2D pitch, stumps, batsman SVG, ball
// CS-4032 Web Programming · Assignment 02
// ============================================================

import React from 'react';

interface BallPosition {
  x: number;
  y: number;
}

interface Props {
  ballPos: BallPosition;
  showBall: boolean;
  isBowling: boolean;
  batsmanHitting: boolean;
  resultText: string;
  resultColor: string;
  commentary: string;
}

// ── Cloud config ──
const CLOUDS = [
  { w: 80,  h: 20, t: 20, l: '10%', dur: '18s', delay: '0s'  },
  { w: 120, h: 28, t: 35, l: '35%', dur: '25s', delay: '-5s' },
  { w: 60,  h: 16, t: 10, l: '65%', dur: '15s', delay: '-10s'},
];

const CricketField: React.FC<Props> = ({
  ballPos,
  showBall,
  isBowling,
  batsmanHitting,
  resultText,
  resultColor,
  commentary,
}) => {
  return (
    <div style={{ position: 'relative' }}>

      {/* ── Sky ── */}
      <div className="sky">
        {CLOUDS.map((c, i) => (
          <div key={i} className="cloud" style={{
            width: c.w, height: c.h, top: c.t, left: c.l,
            animationDuration: c.dur, animationDelay: c.delay,
          }} />
        ))}
      </div>

      {/* ── Crowd ── */}
      <div className="crowd-row">
        <div className="crowd-dots">
          {Array.from({ length: 70 }).map((_, i) => (
            <div key={i} className="crowd-dot"
              style={{ background: `hsl(${(i * 37) % 360}, 60%, 55%)` }} />
          ))}
        </div>
      </div>

      {/* ── Outfield ── */}
      <div className="outfield">

        {/* Pitch strip */}
        <div className="pitch-strip" />

        {/* Bowling stumps (top) */}
        <div style={{
          position: 'absolute', top: 14, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 4, zIndex: 5,
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ position: 'relative' }}>
              <div className="stump" style={{ height: 28 }} />
              {i === 1 && <div className="bail" style={{ width: 12, top: -2, left: 0 }} />}
            </div>
          ))}
        </div>

        {/* Batting stumps (bottom) */}
        <div className="stumps" style={{ zIndex: 5 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ position: 'relative' }}>
              <div className="stump" />
              {i === 1 && <div className="bail" />}
            </div>
          ))}
        </div>

        {/* Cricket Ball */}
        {showBall && (
          <div className="ball" style={{
            left: `calc(50% - 8px + ${ballPos.x}px)`,
            top: ballPos.y,
            opacity: 1,
            transition: isBowling ? 'top 0.6s ease-in' : 'none',
          }} />
        )}

        {/* Batsman SVG */}
        <div className={`batsman-wrap ${batsmanHitting ? 'hitting' : ''}`} style={{ zIndex: 6 }}>
          <svg viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
            {/* Helmet */}
            <ellipse cx="40" cy="22" rx="18" ry="16" fill="#1a5276" />
            <ellipse cx="40" cy="28" rx="16" ry="8" fill="#154360" />
            <rect x="24" y="28" width="8" height="6" rx="2" fill="#f39c12" />
            {/* Face */}
            <ellipse cx="40" cy="38" rx="10" ry="12" fill="#f0c080" />
            <circle cx="36" cy="36" r="2" fill="#333" />
            <circle cx="44" cy="36" r="2" fill="#333" />
            {/* Jersey */}
            <rect x="28" y="50" width="24" height="30" rx="4" fill="#27ae60" />
            <rect x="32" y="52" width="4" height="28" fill="#229954" />
            <rect x="36" y="52" width="4" height="28" fill="#1e8449" />
            {/* Arms */}
            <rect x="14" y="50" width="14" height="10" rx="5" fill="#27ae60" transform="rotate(-20, 21, 55)" />
            <rect x="52" y="50" width="14" height="10" rx="5" fill="#27ae60" transform="rotate(15, 59, 55)" />
            {/* Gloves */}
            <circle cx="16" cy="64" r="7" fill="#e74c3c" />
            <circle cx="64" cy="60" r="7" fill="#e74c3c" />
            {/* Bat */}
            <rect x="60" y="56" width="6" height="50" rx="3" fill="#d4a96a" transform="rotate(-10, 63, 80)" />
            <rect x="61" y="105" width="4" height="8" rx="2" fill="#8d6e3a" transform="rotate(-10, 63, 80)" />
            {/* Pads */}
            <rect x="30" y="80" width="10" height="35" rx="5" fill="white" />
            <rect x="40" y="80" width="10" height="35" rx="5" fill="white" />
            {/* Boots */}
            <ellipse cx="35" cy="115" rx="10" ry="5" fill="#222" />
            <ellipse cx="45" cy="115" rx="10" ry="5" fill="#222" />
          </svg>
        </div>

        {/* Result / Commentary Toast */}
        <div
          className={`result-toast ${resultText ? 'show' : ''}`}
          style={{ borderColor: resultColor, color: resultColor }}
        >
          {resultText}
          <span className="commentary">{commentary}</span>
        </div>

      </div>
    </div>
  );
};

export default CricketField;
