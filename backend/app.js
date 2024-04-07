require("dotenv").config();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const account = require("./routes/account");
const groups = require("./routes/groups");
const getmembers = require("./routes/groupmembers")
const auth = require("./routes/authentication");
const movies = require("./routes/movie_search");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true})) // vastaanottaa form-url-encoded. Jaakko
app.use(express.json()) // Ottaa vastaaan jsonia. Jaakko
app.use((cors())) // poistaa header-ongelmia. Jaakko
app.use("/account", account);
app.use("/groups", groups);
app.use("/auth", auth); // Hieman muuttelin osoitteita. keskustellaan näistä. Jaakko
app.use("/movies", movies);
app.use("/getmembers", getmembers)


app.listen(PORT, () => {
  console.log("Server running:" + PORT);
});

app.get("/", (req, res) => {
  res.send("moro");
});


//Tämä toistaiseksi testinä -Taneli
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log("token = "+token);
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, function(err, username) {

    if (err) return res.sendStatus(403)

    req.username = username

    next()
  })
}