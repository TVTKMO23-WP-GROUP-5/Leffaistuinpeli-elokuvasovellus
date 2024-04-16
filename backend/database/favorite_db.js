const pgPool = require("./pg_connection");

const sql = {
    POST_FAVORITE: "INSERT INTO favorites (idmovie, username) VALUES ($1, $2)",
    POST_GROUP_FAVORITE: "INSERT INTO groupmovies (idmovie, groupname) VALUES ($1, $2)",
    GET_OWN_FAVORITES: "SELECT * FROM favorites",
    GET_GROUP_FAVORITES: "SELECT * FROM groupmovies WHERE groupname=$1"
};

async function addFavorite(idmovie, username) {
  await pgPool.query(sql.POST_FAVORITE, [idmovie, username]);
}

async function addGroupFavorite(idmovie, groupname) {
    await pgPool.query(sql.POST_GROUP_FAVORITE, [idmovie, groupname]);
  }

async function getOwnFavorites() {
    let result = await pgPool.query(sql.GET_OWN_FAVORITES);
    return result.rows;
}

async function getGroupFavorites(groupname) {
    let result = await pgPool.query(sql.GET_GROUP_FAVORITES, [groupname]);
    return result.rows;
}

module.exports = { addFavorite, addGroupFavorite, getOwnFavorites, getGroupFavorites };
