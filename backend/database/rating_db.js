const pgPool = require("./pg_connection");

const sql = {
  POST_RATING: "INSERT INTO ratings (idmovie, media_type, username, stars, description) VALUES ($1, $2, $3, $4, $5)",
  GET_ALL_RATINGS: "SELECT * FROM ratings"
}

async function addRating(idmovie, media_type, username, stars, description) {
  let result = await pgPool.query(sql.POST_RATING, [idmovie, media_type, username, stars, description]); // Lisäsin media_typen helpottamaan jatkokäsittelyä
}

async function getAllRatings() {
  let result = await pgPool.query(sql.GET_ALL_RATINGS);
  return result.rows;
}

module.exports = { addRating, getAllRatings };