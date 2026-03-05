const express = require("express");
const router = express.Router();
const User = require("./task3_AI_User");
const authMiddleware = require("./task3_AI_Authmiddleware");


// REGISTER
router.post("/register", async (req, res) => {

  const { username, password } = req.body;

  const user = new User(username, password);

  const result = await user.register();

  res.send(result);

});


// LOGIN
router.post("/login", async (req, res) => {

  const { username, password } = req.body;

  const user = new User(username, password);

  const result = await user.login();

  if (result) {

    req.session.user = username;

    res.send("Login successful");

  } else {

    res.send("Invalid username or password");

  }

});


// DASHBOARD (Protected)
router.get("/dashboard", authMiddleware, (req, res) => {

  res.send(`Welcome ${req.session.user}`);

});


// LOGOUT
router.get("/logout", (req, res) => {

  req.session.destroy(() => {

    res.send("Logout successful");

  });

});

module.exports = router;