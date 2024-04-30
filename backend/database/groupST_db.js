const pgPool = require("./pg_connection");

const sql = {
  POST_SHOWTIME: `INSERT INTO groupshowtimes (groupname, theatreID, 
                  showdate, movieID, movieTitle, showStartTime, img)
                  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  GET_SHOWTIMES: `SELECT theatreid, showdate, movieid, movietitle, 
                  showstarttime, img FROM groupshowtimes WHERE groupname=$1`,
};

async function addShowtime(
  groupname,
  theatreID,
  showdate,
  movieID,
  movieTitle,
  showStartTime,
  img
) {
  await pgPool.query(sql.POST_SHOWTIME, [
    groupname,
    theatreID,
    showdate,
    movieID,
    movieTitle,
    showStartTime,
    img,
  ]);
}

async function getGroupShowtimes(groupname) {
  let result = await pgPool.query(sql.GET_SHOWTIMES, [groupname]);
  return result.rows;
}

module.exports = { addShowtime, getGroupShowtimes };
