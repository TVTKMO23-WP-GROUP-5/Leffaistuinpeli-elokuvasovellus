require('dotenv').config()
const jwt = require('jsonwebtoken')
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { register, getPw } = require("../database/auth_db");

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
    console.log("Täällä");
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
