require('dotenv').config()
const jwt = require('jsonwebtoken')
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { register, getPw, deleteAccount, deleteRatings, deleteFavorites, getUserData } = require("../database/auth_db")

router.post("/register", async (req, res) => {
  try {  
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const hashPw = await bcrypt.hash(password, 10);
    await register(fname, lname, email, username, hashPw);
    res.status(200).json({message: "success"})
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
    res.status(404).json({ error: "User not found" });
  }
});

router.delete("/delete", async (req, res) => {
  const username = req.body.username;
  
  try {
    const ratingsResult = await deleteRatings(username);
    if (!ratingsResult.success) {
      return res.status(500).json({ error: "Failed to delete user ratings"})
    }

    const favoriteResult = await deleteFavorites(username);
    if (!favoriteResult.success) {
      return res.status(500).json({ error: "Failed to delete user favorites"})
    }


    const accountResult = await deleteAccount(username);
    if (accountResult.rowCount > 0) {
      res.status(200).json({ message: "All user data deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/userdata", async (req, res) => {
  const username = req.query.username;
  
  try {
    const userData = await getUserData(username);
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
