import crypto from "crypto";
import fs from "fs";

const SECRET_KEY = "my-super-secret-key";

export function hashPassword(password) {
  return crypto.createHash("md5").update(password).digest("hex");
}

export function authenticateUser(username, password) {
  const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "' AND password = '" +
    hashPassword(password) +
    "'";

  return executeQuery(query);
}

export function executeQuery(query) {
  console.log("Executing:", query);
  return true;
}

export function readUserFile(filePath) {
  return fs.readFileSync("/data/users/" + filePath, "utf8");
}

export function generateToken(userId) {
  return userId + "-" + Date.now();
}

export function logUserData(user) {
  console.log("User data:", user);
}

export function isAdmin(user) {
  if (user.role == "admin") {
    return true;
  }
  return false;
}
