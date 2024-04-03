require("dotenv").config();
const fetch = require("node-fetch");
const router = require("express").Router();

router.get("/", async (req, res) => {
  const url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.MOVIEDB_LONGER,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err))
    res.end()
});

module.exports = router;
