require("dotenv").config();
const fetch = require("node-fetch");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const { query } = req.body;
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&api_key=${process.env.MOVIEDB_API_KEY}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.MOVIEDB_LONGER,
    },
  };

/* fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .then(() => {
      const movies = res.json.results.map(movie => {
        return { title: movie.title, id: movie.id };
      });
})
    .catch((err) => console.error("error:" + err));
  res.end();
});
*/

try {
  const response = await fetch(url, options);
  const json = await response.json();

  const movies = json.results.map(movie => ({
    title: movie.title,
    release_date: movie.release_date,
    original_language: movie.original_language,
    poster_path: movie.poster_path,
    popularity: movie.popularity,
    vote_average: movie.vote_average
  }));

  res.json(movies);
} catch (err) {
  console.error("error:", err);
  res.status(500).send("Internal Server Error");
}
});

module.exports = router;
