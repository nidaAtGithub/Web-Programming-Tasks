// ============================================================
// App.tsx — Root component, all game state & logic lives here
// CS-4032 Web Programming · Assignment 02
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';

import CricketField  from './components/CricketField';
import PowerBar      from './components/PowerBar';
import Scoreboard    from './components/Scoreboard';
import BallTracker   from './components/BallTracker';
import GameOver      from './components/GameOver';

import {
  BattingStyle, GamePhase, BallRecord, OutcomeKey,
  TOTAL_BALLS, TOTAL_WICKETS,
  buildSegments, pickCommentary,
} from './gameData';

// ── Game State Interface ────────────────────────────────────
interface GameState {
  runs:           number;
  wickets:        number;
  balls:          number;
  ballHistory:    BallRecord[];
  bStyle:         BattingStyle;
  phase:          GamePhase;
  sliderPos:      number;      // 0.0 – 1.0
  sliderDir:      1 | -1;
  resultText:     string;
  resultColor:    string;
  commentary:     string;
  ballPos:        { x: number; y: number };
  batsmanHitting: boolean;
  gameOverReason: string;
}

// ── Initial state factory ───────────────────────────────────
function initState(): GameState {
  return {
    runs: 0, wickets: 0, balls: 0,
    ballHistory: [],
    bStyle: 'aggressive',
    phase: 'idle',
    sliderPos: 0, sliderDir: 1,
    resultText: '', resultColor: '#f5c842', commentary: '',
    ballPos: { x: 0, y: 20 },
    batsmanHitting: false,
    gameOverReason: '',
  };
}

// ── App ─────────────────────────────────────────────────────
const App: React.FC = () => {

  const [state, setState] = useState<GameState>(initState);

  // Timers kept in refs so they survive re-renders
  const sliderRef       = useRef<ReturnType<typeof setInterval>  | null>(null);
  const bowlTimerRef    = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const resultTimerRef  = useRef<ReturnType<typeof setTimeout>   | null>(null);

  // ── Slider animation loop ─────────────────────────────────
  useEffect(() => {
    if (state.phase !== 'waiting') {
      if (sliderRef.current) clearInterval(sliderRef.current);
      return;
    }

    let pos = state.sliderPos;
    let dir = state.sliderDir;

    sliderRef.current = setInterval(() => {
      pos += dir * 0.012;
      if (pos >= 1) { pos = 1; dir = -1; }
      if (pos <= 0) { pos = 0; dir =  1; }
      setState(s => ({ ...s, sliderPos: pos, sliderDir: dir }));
    }, 16);   // ~60fps

    return () => { if (sliderRef.current) clearInterval(sliderRef.current); };
  }, [state.phase]);   // only restart when phase changes

  // ── Start bowling animation ───────────────────────────────
  const startBowling = useCallback(() => {
    setState(s => ({ ...s, phase: 'bowling', ballPos: { x: 0, y: 20 } }));

    // Tiny delay so React paints the ball at y=20 first
    requestAnimationFrame(() => {
      setTimeout(() => {
        setState(s => ({ ...s, ballPos: { x: 0, y: 160 } }));
      }, 50);
    });

    bowlTimerRef.current = setTimeout(() => {
      setState(s => ({ ...s, phase: 'waiting' }));
    }, 750);
  }, []);

  // ── Player clicks PLAY SHOT ───────────────────────────────
  const playShot = useCallback(() => {
    if (state.phase !== 'waiting') return;
    if (sliderRef.current) clearInterval(sliderRef.current);

    // Determine result from slider position
    const pos  = state.sliderPos;
    const segs = buildSegments(state.bStyle);
    const hit  = segs.find(s => pos >= s.start && pos < s.end) ?? segs[segs.length - 1];

    const comment   = pickCommentary(hit.outcome as OutcomeKey);
    const newRuns   = hit.runs != null ? state.runs + hit.runs : state.runs;
    const newWickets= hit.outcome === 'W' ? state.wickets + 1 : state.wickets;
    const newBalls  = state.balls + 1;
    const isOver    = newBalls >= TOTAL_BALLS || newWickets >= TOTAL_WICKETS;
    const reason    = newWickets >= TOTAL_WICKETS ? 'All Out!' : 'Overs Complete!';

    // Batsman swing animation
    setState(s => ({ ...s, batsmanHitting: true }));
    setTimeout(() => setState(s => ({ ...s, batsmanHitting: false })), 400);

    // Build result label
    let resultText: string;
    if      (hit.outcome === 'W') resultText = '🏏 OUT!';
    else if (hit.runs === 6)      resultText = '🎉 SIX!';
    else if (hit.runs === 4)      resultText = '⚡ FOUR!';
    else                          resultText = `${hit.runs} Run${hit.runs !== 1 ? 's' : ''}`;

    setState(s => ({
      ...s,
      runs: newRuns, wickets: newWickets, balls: newBalls,
      ballHistory: [...s.ballHistory, { outcome: hit.outcome as OutcomeKey, runs: hit.runs, style: s.bStyle }],
      phase: 'result',
      resultText,
      resultColor: hit.color,
      commentary: comment,
      gameOverReason: reason,
    }));

    resultTimerRef.current = setTimeout(() => {
      setState(s => ({
        ...s,
        phase: isOver ? 'gameover' : 'idle',
        resultText: '', commentary: '',
      }));
    }, 1800);
  }, [state]);

  // ── Bowl next ball (idle → bowling) ──────────────────────
  const newBall = useCallback(() => {
    if (state.phase === 'idle') startBowling();
  }, [state.phase, startBowling]);

  // ── Change batting style (only while idle) ───────────────
  const setStyle = useCallback((s: BattingStyle) => {
    setState(prev => prev.phase === 'idle' ? { ...prev, bStyle: s } : prev);
  }, []);

  // ── Restart game ─────────────────────────────────────────
  const restart = useCallback(() => {
    if (bowlTimerRef.current)   clearTimeout(bowlTimerRef.current);
    if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    if (sliderRef.current)      clearInterval(sliderRef.current);
    setState(initState());
  }, []);

  // ── Derived display values ────────────────────────────────
  const overs     = `${Math.floor(state.balls / 6)}.${state.balls % 6}`;
  const ballsLeft = TOTAL_BALLS - state.balls;
  const canSwitch = state.phase === 'idle';

  // ── Render ────────────────────────────────────────────────
  return (
    <div>
      <div className="field-wrapper">

        {/* Title bar */}
        <div className="title-bar">
          <div>
            <div className="game-title">🏏 CRICKET BLITZ</div>
            <div className="game-subtitle">CS-4032 · Assignment 02 · Single Player</div>
          </div>
          <button className="restart-btn" onClick={restart}>↺ RESTART</button>
        </div>

        {/* Scoreboard */}
        <Scoreboard
          runs={state.runs}
          wickets={state.wickets}
          totalWickets={TOTAL_WICKETS}
          overs={overs}
          ballsLeft={ballsLeft}
        />

        {/* Cricket field (visuals + ball + batsman) */}
        <CricketField
          ballPos={state.ballPos}
          showBall={state.phase === 'bowling' || state.phase === 'waiting'}
          isBowling={state.phase === 'bowling'}
          batsmanHitting={state.batsmanHitting}
          resultText={state.resultText}
          resultColor={state.resultColor}
          commentary={state.commentary}
        />

        {/* Game Over overlay */}
        {state.phase === 'gameover' && (
          <GameOver
            runs={state.runs}
            wickets={state.wickets}
            overs={overs}
            reason={state.gameOverReason}
            onRestart={restart}
          />
        )}

        {/* Controls */}
        <div className="controls">

          {/* Batting style buttons */}
          <div className="style-row">
            <button
              className={`style-btn aggressive ${state.bStyle === 'aggressive' ? 'active' : ''}`}
              onClick={() => setStyle('aggressive')}
              disabled={!canSwitch}
            >
              ⚡ AGGRESSIVE
              <span className="style-hint">High risk · High reward · Wicket 30%</span>
            </button>
            <button
              className={`style-btn defensive ${state.bStyle === 'defensive' ? 'active' : ''}`}
              onClick={() => setStyle('defensive')}
              disabled={!canSwitch}
            >
              🛡️ DEFENSIVE
              <span className="style-hint">Low risk · Low reward · Wicket 15%</span>
            </button>
          </div>

          {/* Probability power bar */}
          <PowerBar
            style={state.bStyle}
            sliderPos={state.sliderPos}
            isActive={state.phase === 'waiting'}
          />

          {/* Ball history dots */}
          <BallTracker history={state.ballHistory} />

          {/* Main action button — label changes with game phase */}
          {state.phase === 'idle' && (
            <button className="play-btn" onClick={newBall}>
              🎳 BOWL NEXT BALL
            </button>
          )}
          {state.phase === 'bowling' && (
            <button className="play-btn" disabled>● BOWLING...</button>
          )}
          {state.phase === 'waiting' && (
            <button className="play-btn" onClick={playShot}>
              🏏 PLAY SHOT
            </button>
          )}
          {state.phase === 'result' && (
            <button className="play-btn" disabled>...</button>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;
