// ============================================================
// Home.tsx — Home page with a welcome message
// ============================================================

import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page">
      <div className="card">
        <h1>Welcome!</h1>
        <p>
          This is a simple React application that demonstrates
          client-side routing using <strong>React Router v6</strong>.
        </p>
        <p>
          Use the navigation bar above to switch between the
          <strong> Home</strong>, <strong>About</strong>, and{' '}
          <strong>Contact</strong> pages — all without any page reload.
        </p>
      </div>
    </div>
  );
};

export default Home;
