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

  const url_for_total_pages = `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${process.env.MOVIEDB_API_KEY}&language=fi-FI&page=${1}`
  const initialResp = await fetch(url_for_total_pages)
  const initialJson = await initialResp.json()
  let totalPages = initialJson.total_pages
  if (totalPages > pages){
    totalPages = pages
  }

  let urls = []
  
  for (let i = 1; i <= totalPages; i++){  
    urls.push(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${process.env.MOVIEDB_API_KEY}&language=fi-FI&page=${i}`)
  }
  console.log("koko haku: ", totalPages)
  // tässä kutsutaan funktiota.
  movieResponse(urls, req, res, totalPages)

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

  let urls = []
  
  const url_for_total_pages = "https://api.themoviedb.org/3/discover/movie?" +
  "primary_release_year=" + year +
  "&sort_by=" + sort +
  "&with_cast=" + cast +
  "&with_genres=" + genre +
  "&with_original_language=" + language +
  "&page=" + 1 +
  "&language=fi-FI" +
  "&api_key=" + process.env.MOVIEDB_API_KEY
  const initialResp = await fetch(url_for_total_pages)
  const initialJson = await initialResp.json()
  let totalPages = initialJson.total_pages
  if (totalPages > pages){
    totalPages = pages
  }


  for (let i = 1; i <= totalPages; i++){  
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

  console.log("Leffa haku: ", totalPages)
  // tässä kutsutaan funktiota.
  movieResponse(urls, req, res, totalPages)
});

// ------- TARKENNETTU SARJAHAKU -------------- //
router.post("/series", async (req, res) => {
  const year = req.body.year
  const sort = req.body.sort
  const genre = req.body.genre
  const language = req.body.language
  const pages = req.body.pages

  let urls = []

  const url_for_total_pages = "https://api.themoviedb.org/3/discover/tv?" +
  "primary_release_year=" + year +
  "&sort_by=" + sort +
  "&with_genres=" + genre +
  "&with_original_language=" + language +
  "&page=" + 1 +
  "&language=fi-FI" +
  "&api_key=" + process.env.MOVIEDB_API_KEY
  const initialResp = await fetch(url_for_total_pages)
  const initialJson = await initialResp.json()
  let totalPages = initialJson.total_pages
  if (totalPages > pages){
    totalPages = pages
  }

  for (let i = 1; i <= totalPages; i++){  
  urls.push("https://api.themoviedb.org/3/discover/tv?" +
    "first_air_date_year=" + year +
    "&sort_by=" + sort +
    "&with_genres=" + genre +
    "&with_original_language=" + language +
    "&page=" + i +
    "&language=fi-FI" +
    "&api_key=" + process.env.MOVIEDB_API_KEY)
  }

  console.log("Sarjahaku: ", totalPages)
  // tässä kutsutaan funktiota.
  movieResponse(urls, req, res, totalPages)
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
      id: movie.id,
      type: determineMediaType(movie)
    }));

    res.json(movies);
  } catch (err) {
    console.error("error:", err);
    res.status(500).send("Internal Server Error");
  }
}

determineMediaType = (movie) => {
  if (movie.title) {
    return "movie";
  } else if (movie.name) {
    return "tv";
  } else {
    return "unknown";
  }
}
