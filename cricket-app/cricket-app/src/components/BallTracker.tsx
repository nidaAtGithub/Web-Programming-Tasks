// ============================================================
// BallTracker.tsx — Row of dots showing each ball result
// CS-4032 Web Programming · Assignment 02
// ============================================================

import React from 'react';
import { BallRecord } from '../gameData';

interface Props {
  history: BallRecord[];
}

const BallTracker: React.FC<Props> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="ball-tracker">
      {history.map((ball, i) => {
        let dotClass = 'ball-dot';
        let label: string;

        if (ball.outcome === 'W') {
          dotClass += ' wicket-dot';
          label = 'W';
        } else if (ball.runs && ball.runs > 0) {
          dotClass += ' run-dot';
          label = String(ball.runs);
        } else {
          dotClass += ' dot-ball';
          label = '•';
        }

        return (
          <div key={i} className={dotClass} title={`Ball ${i + 1}: ${label}`}>
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default BallTracker;
