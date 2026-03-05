// server.js - Main Express Server
const express = require('express');
const session = require('express-session');
const connectDB = require('./task3_DB');
const { User } = require('./task3_User');
const isAuthenticated = require('./task3_Authmiddleware');

const app = express();
const PORT = 3000;

// ─────────────────────────────────────────────
// 1. Connect to MongoDB
// ─────────────────────────────────────────────
connectDB();

const cors = require('cors');
app.use(cors({ origin: true, credentials: true }));
app.use(express.static(__dirname));
// ─────────────────────────────────────────────
// 2. Global Middleware
// ─────────────────────────────────────────────
app.use(express.json());                    // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

app.use(session({
  secret: 'mySecretKey123',   // Secret used to sign the session ID cookie
  resave: false,              // Don't re-save session if not modified
  saveUninitialized: false,   // Don't create sessions for unauthenticated users
  cookie: {
    maxAge: 1000 * 60 * 60,  // Session expires after 1 hour
    httpOnly: true,           // Prevent client-side JS from reading the cookie
  },
}));

// ─────────────────────────────────────────────
// 3. Routes
// ─────────────────────────────────────────────

// ── POST /register ────────────────────────────
// Accepts: { username, password }
// Creates a new user in MongoDB
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = new User(username, password);
  const result = await user.register();

  if (result.success) {
    return res.status(201).json({ message: result.message }); // 201 Created
  } else {
    return res.status(400).json({ message: result.message });
  }
});

// ── POST /login ───────────────────────────────
// Accepts: { username, password }
// Validates credentials and creates a session
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = new User(username, password);
  const result = await user.login();

  if (result.success) {
    req.session.user = username; // Store username in session
    return res.status(200).json({ message: result.message });
  } else {
    return res.status(401).json({ message: result.message });
  }
});

// ── GET /dashboard ────────────────────────────
// Protected route — only accessible when logged in
// isAuthenticated middleware guards this route
app.get('/dashboard', isAuthenticated, (req, res) => {
  const username = req.session.user;
  return res.status(200).json({ message: `Welcome ${username}` });
});

// ── GET /logout ───────────────────────────────
// Destroys the current session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    return res.status(200).json({ message: 'Logout successful' });
  });
});

// ── 404 Handler ───────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─────────────────────────────────────────────
// 4. Start Server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;