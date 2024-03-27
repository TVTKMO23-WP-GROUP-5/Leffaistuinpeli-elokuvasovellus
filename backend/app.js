require("dotenv").config();
const account = require("./routes/account");
const login = require("./routes/authentication");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use("/account", account);
app.use("/login", login);

app.listen(PORT, () => {
  console.log("Server running:" + PORT);
});

app.get("/", (req, res) => {
  res.send("moro");
});
