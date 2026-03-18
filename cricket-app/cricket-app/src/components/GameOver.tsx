// ============================================================
// GameOver.tsx — Overlay shown at end of innings
// CS-4032 Web Programming · Assignment 02
// ============================================================

import React from 'react';

interface Props {
  runs: number;
  wickets: number;
  overs: string;
  reason: string;
  onRestart: () => void;
}

function getRatingMessage(runs: number): string {
  if (runs >= 60) return '🏆 Brilliant innings!';
  if (runs >= 40) return '👏 Solid knock!';
  if (runs >= 20) return '🙂 Decent effort!';
  return '😅 Better luck next time!';
}

const GameOver: React.FC<Props> = ({ runs, wickets, overs, reason, onRestart }) => (
  <div className="gameover-overlay">
    <div className="gameover-title">INNINGS OVER</div>
    <div className="gameover-score">
      {reason}&nbsp;|&nbsp;Score:&nbsp;
      <strong style={{ color: '#f5c842' }}>{runs} runs</strong>
      &nbsp;/&nbsp;{wickets} wkts in {overs} overs
    </div>
    <div className="gameover-reason">{getRatingMessage(runs)}</div>
    <button className="restart-btn" onClick={onRestart}>PLAY AGAIN</button>
  </div>
);

export default GameOver;
