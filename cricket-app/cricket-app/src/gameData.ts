// ============================================================
// gameData.ts — Probability tables, commentary, game constants
// CS-4032 Web Programming · Assignment 02
// ============================================================

// ── Types ──────────────────────────────────────────────────
export type BattingStyle = 'aggressive' | 'defensive';
export type OutcomeKey = 'W' | '0' | '1' | '2' | '3' | '4' | '6';
export type GamePhase = 'idle' | 'bowling' | 'waiting' | 'result' | 'gameover';

export interface ProbEntry {
  outcome: OutcomeKey;
  runs: number | null;   // null = wicket
  prob: number;
  label: string;
  color: string;
}

export interface Segment extends ProbEntry {
  start: number;
  end: number;
}

export interface BallRecord {
  outcome: OutcomeKey;
  runs: number | null;
  style: BattingStyle;
}

// ── Game Constants ─────────────────────────────────────────
export const TOTAL_BALLS   = 12;   // 2 overs
export const TOTAL_WICKETS = 2;

// ── Probability Tables ─────────────────────────────────────
// All probabilities must sum exactly to 1.00 per style.
export const PROB_TABLES: Record<BattingStyle, ProbEntry[]> = {
  aggressive: [
    { outcome: 'W', runs: null, prob: 0.30, label: 'OUT!', color: '#e63946' },
    { outcome: '0', runs: 0,    prob: 0.10, label: '0',    color: '#555e7a' },
    { outcome: '1', runs: 1,    prob: 0.10, label: '1',    color: '#457b9d' },
    { outcome: '2', runs: 2,    prob: 0.10, label: '2',    color: '#2d9cdb' },
    { outcome: '3', runs: 3,    prob: 0.05, label: '3',    color: '#06d6a0' },
    { outcome: '4', runs: 4,    prob: 0.20, label: '4',    color: '#f5c842' },
    { outcome: '6', runs: 6,    prob: 0.15, label: '6',    color: '#8338ec' },
  ],
  defensive: [
    { outcome: 'W', runs: null, prob: 0.15, label: 'OUT!', color: '#e63946' },
    { outcome: '0', runs: 0,    prob: 0.25, label: '0',    color: '#555e7a' },
    { outcome: '1', runs: 1,    prob: 0.30, label: '1',    color: '#457b9d' },
    { outcome: '2', runs: 2,    prob: 0.15, label: '2',    color: '#2d9cdb' },
    { outcome: '3', runs: 3,    prob: 0.08, label: '3',    color: '#06d6a0' },
    { outcome: '4', runs: 4,    prob: 0.05, label: '4',    color: '#f5c842' },
    { outcome: '6', runs: 6,    prob: 0.02, label: '6',    color: '#8338ec' },
  ],
};

// ── Commentary Lines (Bonus Feature) ──────────────────────
export const COMMENTARY: Record<OutcomeKey, string[]> = {
  W: [
    'What a delivery! Clean bowled!',
    'Gone! The stumps are shattered!',
    'Caught at mid-off! Walking back early.',
    'Plumb LBW! No question about that.',
    'Soft dismissal — straight to point!',
  ],
  '0': [
    'Dot ball. Good bowling, tight line.',
    'Beaten outside off! Close call.',
    'Excellent fielding — no run there.',
  ],
  '1': [
    'Pushed into the gap for a single.',
    'Running hard — just the one.',
    'Clever placement, one added.',
  ],
  '2': [
    'Driven beautifully, they run two!',
    'Good hustle between the wickets.',
    'Two more on the board!',
  ],
  '3': [
    'Superb running — three runs!',
    'Misfield in the deep, quick three.',
    'Brilliant placement — three!',
  ],
  '4': [
    'FOUR! Racing to the boundary!',
    'Elegant drive, perfectly timed — four!',
    'Through the covers like a bullet!',
  ],
  '6': [
    'SIX! Massive hit over long-on!',
    'Gone into the crowd — MAXIMUM!',
    'What a shot! All the way for six!',
  ],
};

// ── Helper: Build cumulative segments from a probability table ──
export function buildSegments(style: BattingStyle): Segment[] {
  const segs: Segment[] = [];
  let cumulative = 0;
  for (const entry of PROB_TABLES[style]) {
    segs.push({ ...entry, start: cumulative, end: cumulative + entry.prob });
    cumulative += entry.prob;
  }
  return segs;
}

// ── Helper: Pick a random commentary line for an outcome ──
export function pickCommentary(outcome: OutcomeKey): string {
  const pool = COMMENTARY[outcome];
  return pool[Math.floor(Math.random() * pool.length)];
}
