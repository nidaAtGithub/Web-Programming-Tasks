// ============================================================
// About.tsx — About page with app information
// ============================================================

import React from 'react';

const About: React.FC = () => {
  return (
    <div className="page">
      <div className="card">
        <h1>About This App</h1>
        <p>
          This application was built with <strong>React 18</strong> and{' '}
          <strong>TypeScript</strong>, using <strong>Vite</strong> as the
          build tool.
        </p>
        <p>
          Client-side routing is handled by <strong>React Router v6</strong>,
          which means navigating between pages updates the URL and renders
          the correct component — all without a full browser reload.
        </p>
        <p>
          The Contact page demonstrates <strong>controlled form inputs</strong>
          using React's <code>useState</code> hook, where every keystroke
          updates the component state through <code>onChange</code> handlers.
        </p>
      </div>
    </div>
  );
};

export default About;
