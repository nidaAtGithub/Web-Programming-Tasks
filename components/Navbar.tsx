// ============================================================
// Navbar.tsx — Navigation bar with React Router NavLink
// Uses NavLink (not Link) so the active page gets highlighted
// ============================================================

import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      {/* Brand / app name */}
      <span className="brand">MyApp</span>

      {/* NavLink automatically adds className "active" when route matches */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/contact">Contact</NavLink>
    </nav>
  );
};

export default Navbar;
