// ============================================================
// PowerBar.tsx — Probability power bar with animated slider
// CS-4032 Web Programming · Assignment 02
// ============================================================

import React from 'react';
import { BattingStyle, buildSegments } from '../gameData';

interface Props {
  style: BattingStyle;
  sliderPos: number;   // 0.0 – 1.0
  isActive: boolean;   // true while waiting for player to click
}

const PowerBar: React.FC<Props> = ({ style, sliderPos, isActive }) => {
  const segs = buildSegments(style);

  return (
    <div>
      <div className="powerbar-label">
        POWER BAR — {style.toUpperCase()} MODE
      </div>

      {/* Bar + needle */}
      <div className="powerbar-outer">
        <div className="powerbar-track">
          {segs.map((seg, i) => (
            <div
              key={i}
              className="pb-segment"
              style={{
                width: `${seg.prob * 100}%`,
                background: seg.color,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              {/* Only show label if segment is wide enough */}
              {seg.prob >= 0.08 && <span>{seg.label}</span>}
            </div>
          ))}
        </div>

        {/* Moving slider needle */}
        {isActive && (
          <div
            className="slider-needle"
            style={{ left: `${sliderPos * 100}%` }}
          />
        )}
      </div>

      {/* Probability boundary markers below the bar */}
      <div className="pb-markers">
        {segs.map((seg, i) => (
          <div
            key={i}
            className="pb-marker"
            style={{ left: `${seg.start * 100}%` }}
          >
            {seg.start === 0 ? '0' : seg.start.toFixed(2)}
          </div>
        ))}
        {/* Right-end label */}
        <div className="pb-marker" style={{ left: '100%' }}>1.00</div>
      </div>
    </div>
  );
};

export default PowerBar;
