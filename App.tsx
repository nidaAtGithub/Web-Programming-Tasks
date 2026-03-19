// ============================================================
// App.tsx — Root component with React Router configuration
//
// BrowserRouter  → enables client-side routing using the URL
// Routes         → container that holds all Route definitions
// Route          → maps a URL path to a component
// Navbar         → always visible, contains NavLink elements
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar  from './components/Navbar';
import Home    from './pages/Home';
import About   from './pages/About';
import Contact from './pages/Contact';

const App: React.FC = () => {
  return (
    // BrowserRouter wraps everything so all child components
    // can use routing hooks (useNavigate, NavLink, etc.)
    <BrowserRouter>

      {/* Navbar is outside <Routes> so it always renders */}
      <Navbar />

      {/* Routes renders only the first <Route> that matches */}
      <Routes>
        <Route path="/"        element={<Home />}    />
        <Route path="/about"   element={<About />}   />
        <Route path="/contact" element={<Contact />} />

        {/* Catch-all: redirect unknown URLs to Home */}
        <Route path="*" element={<Home />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
