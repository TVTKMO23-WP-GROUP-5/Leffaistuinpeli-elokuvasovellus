const pgPool = require("./pg_connection");

const sql = {
  POST_RATING: "INSERT INTO ratings (idmovie, username, stars, description) VALUES ($1, $2, $3, $4)"
}

async function addRating(idmovie, username, stars, description) {
  let result = await pgPool.query(sql.POST_RATING, [idmovie, username, stars, description]);
}

module.exports = { addRating };