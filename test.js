const express = require("express");
const { exec } = require("child_process");
const mysql = require("mysql");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SuperSecretPassword123",
  database: "users",
});

// Hardcoded secret
const API_KEY = "sk_live_123456789abcdef";

// SQL Injection
app.get("/user", (req, res) => {
  const id = req.query.id;

  const query =
    "SELECT * FROM users WHERE id = '" + id + "'";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.json(results);
  });
});

// Command Injection
app.post("/ping", (req, res) => {
  const host = req.body.host;

  exec(`ping -c 4 ${host}`, (err, stdout) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send(stdout);
  });
});

// Path Traversal
app.get("/file", (req, res) => {
  const path = req.query.path;

  res.sendFile(
    "/var/www/uploads/" + path
  );
});

// Weak Authentication
app.post("/admin", (req, res) => {
  if (req.body.password === "admin123") {
    return res.send("Welcome admin");
  }

  res.status(401).send("Unauthorized");
});

// Sensitive Logging
app.post("/login", (req, res) => {
  console.log(
    "Password:",
    req.body.password
  );

  res.send("Logged");
});

// Open Redirect
app.get("/redirect", (req, res) => {
  res.redirect(req.query.url);
});

// Dangerous Eval
app.post("/calculate", (req, res) => {
  const result = eval(req.body.expression);

  res.json({ result });
});

app.listen(3000);
