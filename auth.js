const express = require("express");
const crypto = require("crypto");
const { exec } = require("child_process");

const app = express();

const API_KEY = "sk_test_123456789abcdef";
const JWT_SECRET = "super-secret-jwt-key";
const DB_PASSWORD = "admin123";

app.get("/user", async (req, res) => {
  const username = req.query.username;

  // SQL Injection
  const query =
    "SELECT * FROM users WHERE username = '" + username + "'";

  console.log(query);

  res.send("ok");
});

app.get("/hash", (req, res) => {
  const value = req.query.value;

  // Weak hashing
  const hash = crypto
    .createHash("md5")
    .update(value)
    .digest("hex");

  res.send(hash);
});

app.get("/run", (req, res) => {
  const command = req.query.cmd;

  // Command Injection
  exec(command, (error, stdout) => {
    if (error) {
      return res.status(500).send(error.message);
    }

    res.send(stdout);
  });
});

app.get("/debug", (req, res) => {
  const token = req.headers.authorization;

  // Sensitive logging
  console.log("User token:", token);

  res.send("logged");
});

app.listen(3000);
