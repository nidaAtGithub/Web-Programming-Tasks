// ============================================================
// Scoreboard.tsx — Live game scoreboard
// CS-4032 Web Programming · Assignment 02
// ============================================================

import React from 'react';

interface Props {
  runs: number;
  wickets: number;
  totalWickets: number;
  overs: string;
  ballsLeft: number;
}

interface CellProps {
  label: string;
  value: string | number;
  colorClass?: string;
}

// ── Individual score cell ──
const ScoreCell: React.FC<CellProps> = ({ label, value, colorClass = '' }) => (
  <div className="score-cell">
    <div className="score-label">{label}</div>
    <div className={`score-value ${colorClass}`}>{value}</div>
  </div>
);

const Scoreboard: React.FC<Props> = ({ runs, wickets, totalWickets, overs, ballsLeft }) => (
  <div className="scoreboard">
    <ScoreCell label="Runs"       value={runs} />
    <ScoreCell label="Wickets"    value={`${wickets}/${totalWickets}`} colorClass="red" />
    <ScoreCell label="Overs"      value={overs}      colorClass="green" />
    <ScoreCell label="Balls Left" value={ballsLeft}  colorClass="blue" />
  </div>
);

export default Scoreboard;
