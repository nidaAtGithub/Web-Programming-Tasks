const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const authRoutes = require("./task3_AI_authRoutes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true
}));

app.use("/", authRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});