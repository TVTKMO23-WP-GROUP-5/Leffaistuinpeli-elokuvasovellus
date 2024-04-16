require("dotenv").config();
const fetch = require("node-fetch");
const router = require("express").Router();

// ------------ YLEISHAKU --------------- //
router.post("/", async (req, res) => {
  const query = req.body.search;
  const pages = req.body.pages  // lisäsin toiminnallisuutta, koska perushaku on vain 20 elokuvaa
  /*const url = `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${process.env.MOVIEDB_API_KEY}&language=fi-FI`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.MOVIEDB_LONGER,
    },
  };*/

  let urls = []
  
  for (let i = 1; i <= pages; i++){  
  urls.push(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${process.env.MOVIEDB_API_KEY}&language=fi-FI&page=${i}`)
  }

  // tässä kutsutaan funktiota.
  movieResponse(urls, req, res, pages)

});

// ---------- TARKENNETTU LEFFAHAKU --------------------//
router.post("/filtered", async (req, res) => {
  const year = req.body.year
  let cast = ""
  try {
    const castUrl = `https://api.themoviedb.org/3/search/person?query=${req.body.cast}&api_key=${process.env.MOVIEDB_API_KEY}`
    const resp = await fetch(castUrl);
    const json = await resp.json();
    cast = json.results[0].id
  } catch {
    cast = ""
  }
  const sort = req.body.sort
  const genre = req.body.genre
  const language = req.body.language

  const pages = req.body.pages

  console.log(year, sort, cast, genre, language)
  let urls = []
  
  for (let i = 1; i <= pages; i++){  
  urls.push("https://api.themoviedb.org/3/discover/movie?" +
    "primary_release_year=" + year +
    "&sort_by=" + sort +
    "&with_cast=" + cast +
    "&with_genres=" + genre +
    "&with_original_language=" + language +
    "&page=" + i +
    "&language=fi-FI" +
    "&api_key=" + process.env.MOVIEDB_API_KEY)
  }

  // tässä kutsutaan funktiota.
  movieResponse(urls, req, res, pages)
});

// ------- TARKENNETTU SARJAHAKU -------------- //
router.post("/series", async (req, res) => {
  const year = req.body.year
  const sort = req.body.sort
  const genre = req.body.genre
  const language = req.body.language

  const pages = req.body.pages

  console.log(year, sort, genre, language)
  let urls = []
  
  for (let i = 1; i <= pages; i++){  
  urls.push("https://api.themoviedb.org/3/discover/tv?" +
    "first_air_date_year=" + year +
    "&sort_by=" + sort +
    "&with_genres=" + genre +
    "&with_original_language=" + language +
    "&page=" + i +
    "&api_key=" + process.env.MOVIEDB_API_KEY)
  }

  console.log(urls)

  // tässä kutsutaan funktiota.
  movieResponse(urls, req, res, pages)
});

module.exports = router;

// Tein tämän funktioksi, koska saatan tarvita monessa filteröidyssä haussa. Katsotaan. -Jaakko
async function movieResponse(urls, req, res, sivut) {
  try {
    let moviesJson = []
    for (let i = 0; i < sivut; i++){
      const response = await fetch(urls[i]);
      const json = await response.json();
      moviesJson.push(...json.results)
    }

    const movies = moviesJson.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date,
      original_language: movie.original_language,
      overview: movie.overview,
      poster_path: movie.poster_path,
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      id: movie.id
    }));

    res.json(movies);
  } catch (err) {
    console.error("error:", err);
    res.status(500).send("Internal Server Error");
  }
}
