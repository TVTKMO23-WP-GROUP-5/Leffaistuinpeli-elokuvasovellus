const pgPool = require("./pg_connection");

const sql = {
    POST_FAVORITE: "INSERT INTO favorites (idmovie, username) VALUES ($1, $2)",
    POST_GROUP_FAVORITE: "INSERT INTO groupmovies (idmovie, groupname) VALUES ($1, $2)",
    GET_OWN_FAVORITES: "SELECT idmovie FROM favorites WHERE username=$1",
    GET_GROUP_FAVORITES: "SELECT idmovie FROM groupmovies WHERE groupname=$1",
    CHECK_OWN_FAVORITES: "SELECT EXISTS ( SELECT 1 FROM favorites WHERE idmovie=$1 AND username=$2 )",
    CHECK_GROUP_FAVORITES: "SELECT EXISTS ( SELECT 1 FROM groupmovies WHERE idmovie=$1 AND groupname=$2 )"
};

async function addFavorite(idmovie, username) {
  await pgPool.query(sql.POST_FAVORITE, [idmovie, username]);
}

async function addGroupFavorite(idmovie, groupname) {
    await pgPool.query(sql.POST_GROUP_FAVORITE, [idmovie, groupname]);
}

async function getOwnFavorites(username) {
  let result = await pgPool.query(sql.GET_OWN_FAVORITES, [username]);
  return result.rows;
}

async function getGroupFavorites(groupname) {
  let result = await pgPool.query(sql.GET_GROUP_FAVORITES, [groupname]);
  return result.rows;
}

async function checkOwnFavorites(idmovie, username) {
    let result = await pgPool.query(sql.CHECK_OWN_FAVORITES, [idmovie, username]);
    return result.rows[0].exists;
}

async function checkGroupFavorites(idmovie, groupname) {
    let result = await pgPool.query(sql.CHECK_GROUP_FAVORITES, [idmovie, groupname]);
    return result.rows[0].exists;
}

module.exports = { addFavorite, addGroupFavorite, 
  getOwnFavorites, getGroupFavorites, 
  checkOwnFavorites, checkGroupFavorites 
};
