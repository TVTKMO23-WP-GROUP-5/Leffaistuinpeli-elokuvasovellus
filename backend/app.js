require("dotenv").config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const account = require("./routes/account");
const groups = require("./routes/groups");
const groupST = require("./routes/groupST");
const groupMsg = require("./routes/groupMsg");
const getmembers = require("./routes/groupmembers");
const auth = require("./routes/authentication");
const movies = require("./routes/movie_search");
const random = require('./routes/random_movies');
const rating = require('./routes/rating');
const favorite = require('./routes/favorite');
const express = require("express");
const app = express();
app.use(express.static('public'))
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use((cors()));
app.use("/account", account);
app.use("/groups", groups);
app.use("/groupST", groupST);
app.use("/groupMsg", groupMsg);
app.use("/auth", auth);
app.use("/movies", movies);
app.use("/getmembers", getmembers);
app.use("/random_movies", random);
app.use("/rating", rating);
app.use("/favorite", favorite);


app.listen(PORT, () => {
  console.log("Server running:" + PORT);
});

app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html', function(err){
    if (err) {
      res.status(500).send(err)
    }
  })
})

module.exports = app;