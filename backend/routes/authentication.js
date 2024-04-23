require('dotenv').config()
const { sql } = require("../database/auth_db");
const jwt = require('jsonwebtoken')
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { register, getPw, deleteAccount } = require("../database/auth_db");
const pgPool = require("../database/pg_connection");

router.post("/register", async (req, res) => {
  try {  
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const hashPw = await bcrypt.hash(password, 10);
    await register(fname, lname, email, username, hashPw);
    res.json({message: "success"})
    res.end();
  } catch (error) {
    res.json({message: error})
  }
});

router.post("/login", async (req, res) => {
  const uname = req.body.username;
  const pw = req.body.password;

  const db_pw = await getPw(uname);

  if (db_pw) {
    const isAuth = await bcrypt.compare(pw, db_pw);
    if (isAuth) {
      const token = jwt.sign({ username: uname }, process.env.JWT_SECRET);
      res.status(200).json({ jwtToken: token });
    } else {
      res.status(401).json({ error: "Wrong password" });
    }
  } else {
    res.status(401).json({ error: "User not found" });
  }
});

router.delete("/delete", async (req, res) => {
  const username = req.body.username;
  
  try {
    const result = await deleteAccount(username);
    if (result.rowCount > 0) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:username", async (req, res) => {
  const username = req.params.username;
  
  try {
    const userData = await getUserData(username);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function getUserData(username) {
  const result = await pgPool.query(sql.GET_USER_DATA, [username]);
  return result.rowCount > 0 ? result.rows[0] : null;
}

module.exports = router;
