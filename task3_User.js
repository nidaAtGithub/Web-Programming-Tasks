// User.js - User Class with register() and login() methods
const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// 1. Mongoose Schema for the "users" collection
// ─────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,        // No duplicate usernames
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { collection: 'users' }); // Explicitly set collection name to "users"

const UserModel = mongoose.model('User', userSchema);

// ─────────────────────────────────────────────
// 2. User Class
// ─────────────────────────────────────────────
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  /**
   * register() - Saves a new user to MongoDB.
   * Returns an object: { success: true/false, message: string }
   */
  async register() {
    try {
      // Check if username already exists
      const existing = await UserModel.findOne({ username: this.username });
      if (existing) {
        return { success: false, message: 'Username already exists' };
      }

      // Save plain password (as required by assignment)
      // Note: In production always hash passwords (e.g. bcrypt)
      const newUser = new UserModel({
        username: this.username,
        password: this.password,
      });

      await newUser.save();
      return { success: true, message: 'User registered successfully' };

    } catch (error) {
      return { success: false, message: 'Registration failed: ' + error.message };
    }
  }

  /**
   * login() - Checks credentials against MongoDB.
   * Returns an object: { success: true/false, message: string }
   */
  async login() {
    try {
      const user = await UserModel.findOne({ username: this.username });

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      if (user.password !== this.password) {
        return { success: false, message: 'Incorrect password' };
      }

      return { success: true, message: 'Login successful' };

    } catch (error) {
      return { success: false, message: 'Login failed: ' + error.message };
    }
  }
}

module.exports = { User, UserModel };