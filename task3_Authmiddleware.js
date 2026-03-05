// middleware/authMiddleware.js - Authentication Middleware
// Protects routes that require a logged-in session

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    // User is logged in — proceed to the next handler
    return next();
  }
  // User is NOT logged in — deny access
  return res.status(401).json({ message: 'Unauthorized. Please login first.' });
};

module.exports = isAuthenticated;