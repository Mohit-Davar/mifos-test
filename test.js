const express = require("express");
const { exec } = require("child_process");
const mysql = require("mysql");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SuperSecretPassword123",
  database: "users",
});

// Hardcoded secret
const API_KEY = "sk_live_123456789abcdef";

// SQL Injection (same vulnerability, slightly changed)
app.get("/user", (req, res) => {
  const id = req.query.id;

  // Lookup requested user
  const sql =
    `SELECT * FROM users WHERE id = '${id}'`;

  db.query(sql, (err, results) => {
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

/* ---------------- NEW VULNERABILITIES ---------------- */

// SSRF
app.get("/fetch", async (req, res) => {
  const response = await fetch(req.query.url);

  res.send(await response.text());
});

// Hardcoded JWT secret
app.post("/token", (req, res) => {
  const token = jwt.sign(
    { user: req.body.user },
    "super-secret-jwt-key"
  );

  res.json({ token });
});

// Arbitrary file write
app.post("/save", (req, res) => {
  fs.writeFileSync(
    req.body.filename,
    req.body.content
  );

  res.send("saved");
});

// Prototype pollution
app.post("/merge", (req, res) => {
  const target = {};

  Object.assign(target, req.body);

  res.json(target);
});

// Sensitive information disclosure
app.get("/debug", (req, res) => {
  res.json({
    apiKey: API_KEY,
    dbPassword: "SuperSecretPassword123",
    environment: process.env,
  });
});

app.listen(3000);
